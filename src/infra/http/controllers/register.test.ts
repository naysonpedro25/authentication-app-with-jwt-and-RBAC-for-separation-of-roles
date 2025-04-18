import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import * as process from 'node:process';

describe('Register controller', async () => {
    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    // function getCookieValue(cookies: string[], name: string) {
    //     const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    //     return cookie?.split(';')[0].split('=')[1];
    // }

    test('should be able register a user', async () => {
        const response = await request(app.server).post('/register').send({
            name: 'test123',
            email: 'test123@test.com',
            password: 'test123',
        });
        console.log(response);
        expect(response.status).toEqual(201);

        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
    });
});
