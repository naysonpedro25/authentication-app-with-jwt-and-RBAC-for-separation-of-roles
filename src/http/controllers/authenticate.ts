import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeAuthenticateUseCase } from '@/use-cases/factory/make-authenticate-use-case';

import { z } from 'zod';
import { InvalidCredentials } from '@/use-cases/errors/invalid-credentials-error';
import fastifyJwt from '@fastify/jwt';
import { UserNotValidatedError } from '@/use-cases/errors/user-not-validated-error';

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const regiserBodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { email, password } = regiserBodySchema.parse(request.body);
        const authenticateUseCase = makeAuthenticateUseCase();
        const { user } = await authenticateUseCase.execute({ email, password });

        const token = await reply.jwtSign(
            {
                role: user.role,
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
                path: '/', // quais rotas da aplicação tem acesso ao cookie (todas com o /)
                secure: true, // se o cookie vai ser encriptado com o https (se o front estiver usando https, se for local fudeu), impossibilitando o front de pegar o cookie direto como string
                sameSite: true, // cookie só pode ser acessado dentro do mesmo domínio
                httpOnly: true, // cookie só pode ser acessado pelo back, sem ser armazenado pelo front nos cookies no browser.
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
