import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';

describe('Register controller', async () => {
    beforeAll(async () => {
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });

    test('should be able register a user', async () => {
        const response = await request(app.server).post('/register').send({
            name: 'test123',
            email: 'test123@test.com',
            password: 'test12345', // min 8
        });

        expect(response.status).toEqual(201);

        expect(response.body).toEqual(
            expect.objectContaining({
                message: expect.any(String),
            })
        );
    });
});
