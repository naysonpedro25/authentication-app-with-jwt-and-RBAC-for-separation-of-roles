import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import supertest from 'supertest';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';

describe('Forgot password controller', async () => {
    let userRepository: UserRepositoryInterface;

    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    test('should be able send email vefirication for user', async () => {
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

        const validateResp = await supertest(app.server).patch(
            `/register/validate?token=${user?.verification_token}`
        );
        expect(validateResp.status).toEqual(200);

        const resp = await supertest(app.server)
            .post('/auth/forgot-password')
            .send({
                email: 'delivered@resend.dev',
            });

        expect(resp.status).toEqual(200);

        expect(resp.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
    });
});
