import { fastify } from 'fastify';
import { routes } from './infra/http/routes';
import { ZodError } from 'zod';
import { env } from './env/index';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import fastifyCron from 'fastify-cron';
import { makeDeleteUnverifiedUsers } from '@/application/jobs/factories/make-delete-unverified-users';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
import fastifyRateLimit from '@fastify/rate-limit';

export const app = fastify();

app.register(cors, {
    origin: [env.FRONTEND_URL, 'http:localhost:8080'],
    credentials: true, // permite o envio de cookies do front para o back
});
app.register(fastifyCron, {
    jobs: [makeDeleteUnverifiedUsers()],
});

app.register(cookie);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: '15m',
    },
    cookie: {
        cookieName: 'refreshToken',
        signed: false, // cookie não assinado
    },
});
app.register(routes);
app.register(fastifySwagger, {});
app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

await (async () => {
    await app.register(fastifyRateLimit, {
        global: true,
        max: 100,
        timeWindow: 1000 * 60,
        errorResponseBuilder: function (req, context) {
            return {
                statusCode: 429,
                message: 'You are doing that too much. Chill a bit!',
                max: context.max,
                timeWindow: context.after,
            };
        },
    });
    app.setNotFoundHandler(
        // o handler do 404 depende do plugin assim já ter sido carregado
        {
            preHandler: app.rateLimit({
                max: 5,
                timeWindow: 500,
            }),
        },
        function (req, reply) {
            reply
                .code(404)
                .send({ message: `route ${req.method}${req.url} not found.` });
        }
    );
})();

app.setErrorHandler((error, req, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validate error.', issue: error.format() }); // format só tem no zod
    }

    if (error.statusCode === 429) {
        return reply.status(429).send({
            message: 'Rate limit exceeded. Please wait 1 minute and try again.',
        });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: fazer um log com uma ferramenta externa DataLog/NewRelic/Sentry
    }

    return reply.status(500).send({ message: 'Internal server error.' });
});
