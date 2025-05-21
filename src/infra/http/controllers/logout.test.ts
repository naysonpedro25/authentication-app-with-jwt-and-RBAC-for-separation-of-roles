import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { beforeEach } from 'node:test';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import supertest from 'supertest';

function getCookieValue(cookies: string[] | string, name: string) {
    const cookie = Array.from(cookies).find((c) => c.startsWith(`${name}=`));
    return cookie?.split(';')[0].split('=')[1];
}

describe('Authentication user controller', async () => {
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

        const resp = await supertest(app.server)
            .patch('/auth/logout')
            .set('Authorization', `Bearer ${respAuth.body.token}`)
            .send();
        const cookiesWasItDeleted = getCookieValue(
            resp.headers['set-cookie'],
            'refreshToken'
        );
        expect(resp.status).toEqual(200);
        expect(cookiesWasItDeleted).toBeFalsy();
    });
});
