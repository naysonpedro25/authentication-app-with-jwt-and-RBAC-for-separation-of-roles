import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { beforeEach } from 'node:test';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import supertest from 'supertest';
import { compare, hash } from 'bcryptjs';

function getCookieValue(cookies: string[] | string, name: string) {
    const cookie = Array.from(cookies).find((c) => c.startsWith(`${name}=`));
    return cookie?.split(';')[0].split('=')[1];
}

describe('Change password by user controller', async () => {
    let userRepository: UserRepositoryInterface;

    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {});

    test('should be change password of user', async () => {
        const registerUseCaseResponse = await supertest(app.server)
            .post('/register')
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'test12345',
            });
        expect(registerUseCaseResponse.status).toEqual(201);
        expect(registerUseCaseResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
        const user = await userRepository.findByEmail('test@test.com');
        expect(user).not.toEqual(null);
        await userRepository.changeRole(user?.id ?? '', 'ADM');

        const validateResp = await supertest(app.server).patch(
            `/register/validate?token=${user?.verification_token}`
        );
        expect(validateResp.status).toEqual(200);

        const authResponse = await supertest(app.server).post('/auth').send({
            email: 'test@test.com',
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
            name: 'user-test-change-password',
            email: 'user-test-change-password@gmail.com',
            password_hash: await hash('user-test-change-password123', 6),
        });

        const resp = await supertest(app.server)
            .patch(`/users/${id}/change-password`)
            .set('Authorization', `Bearer ${authResponse.body.token}`)
            .send({
                newPassword: 'test010203',
            });

        expect(resp.status).toEqual(200);

        const chagedPasswordUser = await userRepository.findByEmail(
            'user-test-change-password@gmail.com'
        );
        const isEqualsPasswords = await compare(
            'test010203',
            chagedPasswordUser?.password_hash ?? ''
        );

        expect(isEqualsPasswords).toBeTruthy();
    });
});
