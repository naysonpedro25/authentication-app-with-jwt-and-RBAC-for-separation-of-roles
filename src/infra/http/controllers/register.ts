import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeVerifyUserByEmailUseCase } from '@/application/use-cases/factory/make-verify-user-by-email';
import { z } from 'zod';
import { makeRegisterUseCase } from '@/application/use-cases/factory/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    try {
        const registerBodySchema = z.object({
            name: z.string().max(20),
            email: z.string().email(),
            password: z.string().min(8),
        });

        const { name, email, password } = registerBodySchema.parse(
            request.body
        );

        const registerUseCase = makeRegisterUseCase();

        await registerUseCase.execute({
            email,
            password,
            name,
        });

        return reply
            .status(201)
            .send({ message: 'Verify your e-mail in 30 minutes!' });
    } catch (error) {
        if (error instanceof UserAlreadyExistError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
