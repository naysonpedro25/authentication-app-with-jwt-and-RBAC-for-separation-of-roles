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
import { verifyForgotPassword } from './controllers/forgot-password';
import { getList } from '@/infra/http/controllers/get-list';
import { changePassword } from '@/infra/http/controllers/change-password';
import { resetPassword } from '@/infra/http/controllers/reset-password';
import { changePasswordByAdm } from './controllers/change-password-by-adm';
import { logout } from './controllers/logout';

export async function routes(app: FastifyInstance) {
    app.post('/register', register);
    app.patch('/register/validate', validate);

    app.post('/auth', authenticate);
    app.patch('/auth/refresh-token', refresh);

    app.post('/auth/forgot-password', verifyForgotPassword);
    app.post('/auth/reset-password', resetPassword);
    app.patch(
        '/auth/logout',
        {
            onRequest: [verifyJwt],
        },
        logout
    );
    app.post(
        '/users',
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
        '/users/me',
        {
            onRequest: [verifyJwt],
        },
        deleteMe
    );

    app.delete(
        '/users/:id',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
        },
        deleteUserByAdm
    );
}
