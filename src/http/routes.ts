import { FastifyInstance } from 'fastify';
import { register } from './controllers/register-user';
import { verifyEmailUser } from './controllers/verify-email-user';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJwt } from './middleware/verify-jwt';
import { refresh } from './controllers/refresh';
export async function routes(app: FastifyInstance) {
    app.post('/register/session', verifyEmailUser);
    app.post('/register/validate-email', register);

    app.post('/auth', authenticate);
    app.patch('/token/refresh', refresh);

    app.get(
        '/me',
        {
            onRequest: [verifyJwt],
        },
        profile
    );
}
