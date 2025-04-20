import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { beforeEach } from 'node:test';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import supertest from 'supertest';
import { hash } from 'bcryptjs';

describe('Create user by adm controller', async () => {
    let userRepository: UserRepositoryInterface;

    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {});

    test('should be able create user with id', async () => {
        const user = await userRepository.create({
            name: 'test',
            email: 'test@test.com',
            password_hash: await hash('test12345', 6),
            validated_at: new Date(),
        });
        await userRepository.changeRole(user.id, 'ADM');
        const authResponse = await supertest(app.server).post('/auth').send({
            email: 'test@test.com',
            password: 'test12345',
        });

        const resp = await supertest(app.server)
            .post(`/users`)
            .set('Authorization', `Bearer ${authResponse.body.token}`)
            .send({
                name: 'new-test-user',
                email: 'new-test-user@gmail.com',
                password: 'new-test-user-password',
            });

        expect(resp.status).toEqual(201);
    });
});
