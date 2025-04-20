import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeAuthenticateUseCase } from '@/application/use-cases/factory/make-authenticate-use-case';

import { z } from 'zod';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import fastifyJwt from '@fastify/jwt';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';

export async function logout(request: FastifyRequest, reply: FastifyReply) {
    try {
        return reply
            .clearCookie('refreshToken', {
                path: '/',
            })
            .status(200)
            .send();
    } catch (error) {
        throw error;
    }
}
