import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import * as process from 'node:process';
import { beforeEach } from 'node:test';

describe('Validate user controller', async () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {});

    test('should be able validate user', async () => {
        const resp = await request(app.server)
            .post('/register/verify-email')
            .send({
                name: 'test',
                email: 'test@test.com',
                password: 'test123',
            });
        expect(resp.status).toEqual(200);

        expect(resp.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
        const cookies = resp.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toMatch(/verifyEmailToken=/);
    });
});
