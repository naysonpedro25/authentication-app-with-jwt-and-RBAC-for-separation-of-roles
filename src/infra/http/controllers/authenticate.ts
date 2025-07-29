import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeAuthenticateUseCase } from '@/application/use-cases/factory/make-authenticate-use-case';

import { z } from 'zod';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import fastifyJwt from '@fastify/jwt';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const registerBodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { email, password } = registerBodySchema.parse(request.body);
        const authenticateUseCase = makeAuthenticateUseCase();
        const { user } = await authenticateUseCase.execute({ email, password });

        const token = await reply.jwtSign(
            {
                role: user.role,
                type: 'access',
            },
            {
                sign: {
                    sub: user.id,
                },
            }
        );
        const refreshToken = await reply.jwtSign(
            {
                role: user.role,
                type: 'refresh',
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                },
            }
        );

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true,
                domain: '.naysonpedro.me',
            })
            .status(200)
            .send({
                token,
            });
    } catch (error) {
        if (error instanceof InvalidCredentials) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof UserNotValidatedError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
