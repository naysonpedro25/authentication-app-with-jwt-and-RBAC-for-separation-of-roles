import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import supertest from 'supertest';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { compare } from 'bcryptjs';

describe('Reset password controller', async () => {
    let userRepository: UserRepositoryInterface;

    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    test('should be able resete a user password', async () => {
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

        const validateResp = await supertest(app.server).patch(
            `/register/validate?token=${user?.verification_token}`
        );
        expect(validateResp.status).toEqual(200);

        const respForgotPassword = await supertest(app.server)
            .post('/auth/forgot-password')
            .send({
                email: 'test@test.com',
            });

        expect(respForgotPassword.status).toEqual(200);

        expect(respForgotPassword.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
        const userValidated = await userRepository.findByEmail(
            user?.email ?? ''
        );

        expect(userValidated).not.toBeNull();
        const resp = await supertest(app.server)
            .post(
                '/auth/reset-password?token=' +
                    userValidated?.verification_token
            )
            .send({
                newPassword: 'test010203',
            });
        const userChagedPassword =
            await userRepository.findByEmail('test@test.com');

        const isEqualsPasswords = await compare(
            'test010203',
            userChagedPassword?.password_hash ?? ''
        );

        expect(isEqualsPasswords).toBeTruthy();
        expect(resp.status).toEqual(200);
    });
});
