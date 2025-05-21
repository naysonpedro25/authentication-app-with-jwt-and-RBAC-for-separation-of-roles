import { expect, test, describe, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { afterEach, beforeEach } from 'node:test';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import supertest from 'supertest';

function getCookieValue(cookies: string[] | string, name: string) {
    const cookie = Array.from(cookies).find((c) => c.startsWith(`${name}=`));
    return cookie?.split(';')[0].split('=')[1];
}

describe('Refresh token controller', async () => {
    let userRepository: UserRepositoryInterface;
    beforeAll(async () => {
        await app.ready();
        userRepository = new PrismaUserRepositoryImp();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    test('should be able get new jwt token with refresh token', async () => {
        vi.setSystemTime(new Date(2025, 1, 1, 2, 0, 0));
        const registerUseCaseResponse = await request(app.server)
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

        const respAuth = await supertest(app.server).post('/auth').send({
            email: 'delivered@resend.dev',
            password: 'test12345',
        });

        const cookieRefreshToken = getCookieValue(
            respAuth.headers['set-cookie'],
            'refreshToken'
        );

        expect(respAuth.status).toEqual(200);
        expect(respAuth.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            })
        );
        expect(cookieRefreshToken).toEqual(expect.any(String));

        vi.setSystemTime(new Date(2025, 1, 1, 2, 0, 10));
        const resp = await supertest(app.server)
            .patch('/auth/refresh-token')
            .set('Cookie', respAuth.headers['set-cookie'][0]);

        expect(resp.status).toEqual(200);
        expect(resp.body).toEqual(
            expect.objectContaining({
                token: expect.any(String),
            })
        );

        const newRefreshToken = getCookieValue(
            resp.headers['set-cookie'],
            'refreshToken'
        );

        expect(newRefreshToken).not.toEqual(cookieRefreshToken);
    });
});
// a mudança de tempo garande um iat do refreshToken diferente
