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
export const app = fastify();

app.register(cors, {
    origin: true,
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
app.setErrorHandler((error, req, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validate error.', issue: error.format() }); // format só tem no zod
    }
    // if(error instanceof )

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: fazer um log com uma ferramenta externa DataLog/NewRelic/Sentry
    }

    return reply.status(500).send({ message: 'Internal server error.' });
});
