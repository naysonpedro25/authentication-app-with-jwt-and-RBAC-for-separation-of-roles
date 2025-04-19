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

describe('Get list users controller', async () => {
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
        for (let i = 1; i <= 15; i++) {
            await userRepository.create({
                name: `user-test-name${i}`,
                email: `user-test-email${i}@gmail.com`,
                password_hash: `user-test-hashed-password`,
            });
        }
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

        const resp = await supertest(app.server)
            .get('/users?page=2')
            .set('Authorization', `Bearer ${authResponse.body.token}`);
        expect(resp.body.users).toHaveLength(1);
        expect(resp.body.page).toEqual(2);
        expect(resp.body.users).toEqual([
            expect.objectContaining({
                id: expect.any(String),
                name: 'test',
                email: 'test@test.com',
                role: expect.any(String),
                created_at: expect.any(String),
            }),
        ]);
    });
});
