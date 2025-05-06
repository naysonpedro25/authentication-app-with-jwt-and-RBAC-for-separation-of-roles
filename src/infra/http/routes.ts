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
import { z } from 'zod';
import { FastifyTypedInstance } from '@/@types/fastify-instance';

export async function routes(app: FastifyTypedInstance) {
    app.post(
        '/register',
        {
            schema: {
                tags: ['register'],
                description: 'create a new user',
                body: z.object({
                    name: z.string().max(20),
                    email: z.string().email(),
                    password: z.string().min(8),
                }),
                response: {
                    201: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        register
    );
    app.patch(
        '/register/validate',
        {
            schema: {
                tags: ['register'],
                description: 'Validate user email',
                querystring: z.object({
                    token: z.string().uuid(),
                }),
                response: {
                    200: z.null().describe('User email validated'),
                },
            },
        },
        validate
    );

    app.post(
        '/auth',
        {
            schema: {
                tags: ['auth'],
                description: 'Authenticate user',
                body: z.object({
                    email: z.string().email(),
                    password: z.string().min(8),
                }),
                response: {
                    200: z.object({
                        token: z.string().jwt(),
                    }),
                },
            },
        },
        authenticate
    );

    app.patch(
        '/auth/refresh-token',
        {
            schema: {
                tags: ['auth'],
                description: 'Refresh JWT token',
                response: {
                    200: z.object({
                        token: z.string().jwt(),
                    }),
                },
            },
        },
        refresh
    );

    app.post(
        '/auth/forgot-password',
        {
            schema: {
                tags: ['auth'],
                description: 'Send forgot password email',
                body: z.object({
                    email: z.string().email(),
                }),
                response: {
                    200: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        verifyForgotPassword
    );

    app.post(
        '/auth/reset-password',
        {
            schema: {
                tags: ['auth'],
                description: 'Reset password using token',
                body: z.object({
                    token: z.string().uuid(),
                    newPassword: z.string().min(8),
                }),

                response: {
                    200: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        resetPassword
    );

    app.patch(
        '/auth/logout',
        {
            onRequest: [verifyJwt],
            schema: {
                tags: ['auth'],
                description: 'Logout the current user',
                headers: z.object({
                    Authorization: z.string(),
                }),
                response: {
                    200: z.null().describe('User logged out'),
                },
            },
        },
        logout
    );

    app.post(
        '/users',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
            schema: {
                tags: ['admin'],
                description: 'Create user as admin',
                body: z.object({
                    name: z.string().max(20),
                    email: z.string().email(),
                    password: z.string().min(8),
                    role: z.enum(['ADM', 'USER']),
                }),
                headers: z.object({
                    Authorization: z.string(),
                }),
                response: {
                    201: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        createByAdm
    );

    app.get(
        '/users/me',
        {
            onRequest: [verifyJwt],
            schema: {
                tags: ['users'],
                description: 'Get current authenticated user',
                response: {
                    200: z.object({
                        user: z.object({
                            id: z.string(),
                            name: z.string(),
                            email: z.string(),
                            role: z.string(),
                            created_at: z.date(),
                        }),
                    }),
                },
            },
        },
        profile
    );

    app.get(
        '/users',
        {
            onRequest: [verifyJwt],
            schema: {
                tags: ['users'],
                description: 'Get list of all users (paginated)',
                querystring: z.object({
                    page: z.coerce.number().optional(),
                }),

                response: {
                    200: z.object({
                        users: z.array(
                            z.object({
                                id: z.string(),
                                name: z.string(),
                                email: z.string(),
                                role: z.string(),
                                created_at: z.date(),
                            })
                        ),
                        page: z.number(),
                    }),
                },
            },
        },
        getList
    );

    app.patch(
        '/users/me/change-password',
        {
            onRequest: [verifyJwt],
            schema: {
                tags: ['users'],
                description: 'Change password for current user',
                body: z.object({
                    currentPassword: z.string(),
                    newPassword: z.string().min(6),
                }),
                headers: z.object({
                    Authorization: z.string(),
                }),
                response: {
                    200: z.null().describe('Password changed'),
                },
            },
        },
        changePassword
    );

    app.patch(
        '/users/:id/change-password',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
            schema: {
                tags: ['admin'],
                description: 'Admin changes password of a user',
                params: z.object({
                    id: z.string().uuid(),
                }),
                body: z.object({
                    newPassword: z.string().min(8),
                }),
                headers: z.object({
                    Authorization: z.string(),
                }),
                response: {
                    200: z.null().describe('Password changed'),
                },
            },
        },
        changePasswordByAdm
    );

    app.delete(
        '/users/me',
        {
            onRequest: [verifyJwt],
            schema: {
                tags: ['users'],
                description: 'Delete the current authenticated user',

                headers: z.object({
                    Authorization: z.string(),
                }),
                response: {
                    200: z.null().describe('User deleted'),
                },
            },
        },
        deleteMe
    );

    app.delete(
        '/users/:id',
        {
            onRequest: [verifyJwt, verifyRole('ADM')],
            schema: {
                tags: ['admin'],
                description: 'Delete a user by ID (admin only)',
                params: z.object({
                    id: z.string().uuid(),
                }),

                headers: z.object({
                    Authorization: z.string(),
                }),
                response: {
                    200: z.null().describe('User deleted'),
                },
            },
        },
        deleteUserByAdm
    );
}
