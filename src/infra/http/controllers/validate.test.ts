import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { beforeEach } from 'node:test';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import supertest from 'supertest';

describe('Validate user controller', async () => {
    let userRepository: UserRepositoryInterface;
    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {});

    test('should be able validate user', async () => {
        const RegisterUseCaseResponse = await request(app.server)
            .post('/register')
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'test12334',
            });
        expect(RegisterUseCaseResponse.status).toEqual(201);
        expect(RegisterUseCaseResponse.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
        const user = await userRepository.findByEmail('test@test.com');
        expect(user).not.toEqual(null);

        const resp = await supertest(app.server).patch(
            `/register/validate?token=${user?.verification_token}`
        );
        expect(resp.status).toEqual(200);
    });
});
