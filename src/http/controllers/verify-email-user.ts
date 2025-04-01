import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeVerifyUserByEmailUseCase } from '@/use-cases/factory/make-verify-user-by-email';

import { z } from 'zod';
import { makeRegisterUseCase } from '@/use-cases/factory/make-register-use-case';

export async function verifyEmailUser(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const regiserBodySchema = z.object({
            name: z.string().max(20),
            email: z.string().email(),
            password: z.string().min(6),
        });

        const { name, email, password } = regiserBodySchema.parse(request.body);
        const veriryEmailUseCase = makeVerifyUserByEmailUseCase();
        const regiserUserUseCase = makeRegisterUseCase();

        await regiserUserUseCase.execute({
            email,
            password,
            name,
        });

        const { token } = await veriryEmailUseCase.execute({
            email,
        });

        return reply
            .setCookie('verifyEmailToken', token, {
                secure: true,
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 30, // expira em 2 minutos
            })
            .status(200)
            .send({ message: 'verify your email in 30 minutes' });
    } catch (error) {
        if (error instanceof UserAlreadyExistError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
