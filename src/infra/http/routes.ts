import { FastifyInstance } from 'fastify';
import { validate } from './controllers/validate';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJwt } from './middleware/verify-jwt';
import { refresh } from './controllers/refresh';
import { deleteUserByAdm } from './controllers/delete-user-by-adm';
import { verifyRole } from './middleware/verify-role';
import { deleteMe } from './controllers/delete-me';
import { createByAdm } from './controllers/create-by-adm';
import { verifyForgotPassword } from './controllers/verify-forgot-password';
import { getList } from '@/infra/http/controllers/get-list';
import { changePassword } from '@/infra/http/controllers/change-password';
import { forgotPassword } from '@/infra/http/controllers/forgot-password';
import { changePasswordByAdm } from './controllers/change-password-by-adm';

export async function routes(app: FastifyInstance) {
    app.post('/register', register);
    app.patch('/register/validate', validate);

    app.post('/auth', authenticate);
    app.patch('/token/refresh', refresh);

    app.post('/auth/forgot-password', verifyForgotPassword);
    app.post('/auth/reset-password', forgotPassword);

    app.post(
        '/users/create',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
        },
        createByAdm
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

    app.patch(
        '/users/:id/change-password',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
        },
        changePasswordByAdm
    );

    app.delete(
        '/users/me/delete',
        {
            onRequest: [verifyJwt],
        },
        deleteMe
    );

    app.delete(
        '/users/:id/delete',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
        },
        deleteUserByAdm
    );
}
