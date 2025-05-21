import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { beforeEach } from 'node:test';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import supertest from 'supertest';

function getCookieValue(cookies: string[] | string, name: string) {
    const cookie = Array.from(cookies).find((c) => c.startsWith(`${name}=`));
    return cookie?.split(';')[0].split('=')[1];
}

describe('Delete user by adm controller', async () => {
    let userRepository: UserRepositoryInterface;

    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {});

    test('should be able delete user with id', async () => {
        const registerUseCaseResponse = await supertest(app.server)
            .post('/register')
            .send({
                name: 'test',
                email: 'delivered@resend.dev',
                password: 'test12345',
            });
        expect(registerUseCaseResponse.status).toEqual(201);
        expect(registerUseCaseResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
        const user = await userRepository.findByEmail('delivered@resend.dev');
        expect(user).not.toEqual(null);
        await userRepository.changeRole(user?.id ?? '', 'ADM');

        const validateResp = await supertest(app.server).patch(
            `/register/validate?token=${user?.verification_token}`
        );
        expect(validateResp.status).toEqual(200);

        const authResponse = await supertest(app.server).post('/auth').send({
            email: 'delivered@resend.dev',
            password: 'test12345',
        });

        expect(authResponse.status).toEqual(200);
        expect(authResponse.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            })
        );

        const cookieRefreshToken = getCookieValue(
            authResponse.headers['set-cookie'],
            'refreshToken'
        );
        expect(cookieRefreshToken).toEqual(expect.any(String));
        const { id } = await userRepository.create({
            name: 'test-userToBeDeleted',
            email: 'test-userToBeDeleted@gmail.com',
            password_hash: 'test-userToBeDeletedPassword',
        });

        const resp = await supertest(app.server)
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${authResponse.body.token}`)
            .send();

        expect(resp.status).toEqual(200);
        const isDeletedUser = await userRepository.findByEmail(
            'test-userToBeDeleted@gmail.com'
        );
        expect(isDeletedUser).toBeNull();
    });
});
