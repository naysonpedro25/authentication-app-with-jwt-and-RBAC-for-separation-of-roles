import { FastifyInstance } from 'fastify';
import { register } from './controllers/register-user';
import { verifyEmailUser } from './controllers/verify-email-user';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJwt } from './middleware/verify-jwt';
import { refresh } from './controllers/refresh';
import { deleteUser } from './controllers/delete-user';
import { verifyRole } from './middleware/verify-role';
import { deleteMe } from './controllers/delete-me';
import { createUser } from './controllers/create-user';
import { verifyForgotPassword } from './controllers/verify-forgot-password';
import { getList } from '@/infra/http/controllers/get-list';
import { changePassword } from '@/infra/http/controllers/change-password';
import { forgotPassword } from '@/infra/http/controllers/forgot-password';

export async function routes(app: FastifyInstance) {
    app.post('/register/verify-email', verifyEmailUser);
    app.post('/register', register);

    app.post('/auth', authenticate);
    app.patch('/token/refresh', refresh);

    app.post('/auth/forgot-password', verifyForgotPassword);
    app.post('/auth/reset-password', forgotPassword);

    app.post(
        '/users/create',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
        },
        createUser
    );
    app.get(
        '/users/me',
        {
            onRequest: [verifyJwt],
        },
        profile
    );

    app.get(
        '/users',
        {
            onRequest: [verifyJwt],
        },
        getList
    );

    app.patch(
        '/users/me/change-password',
        {
            onRequest: [verifyJwt],
        },
        changePassword
    );

    app.delete(
        '/me/delete',
        {
            onRequest: [verifyJwt],
        },
        deleteMe
    );

    app.delete(
        '/users/delete/:userId',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
        },
        deleteUser
    );
}
