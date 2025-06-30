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
import {
    validatorCompiler,
    serializerCompiler,
    ZodTypeProvider,
    jsonSchemaTransform,
} from 'fastify-type-provider-zod';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

// usar zod para fazer a validação dados de entrada e a serialização dos dados de saida
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
console.log(env.FRONTEND_URL);
app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true, // permite o envio de cookies do front para o back
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
app.register(fastifyCron, {
    jobs: [makeDeleteUnverifiedUsers()],
});

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '15m',
    },
});
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'User manager API',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
});

app.register(cookie);

app.register(routes);
if (env.NODE_ENV !== 'test') {
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
                reply.code(404).send({
                    message: `route ${req.method}${req.url} not found.`,
                });
            }
        );
    })();
}
app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

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
