import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeRegisterUseCase } from '@/application/use-cases/factory/make-register-use-case';
import { EmailAlreadySentError } from '@/application/use-cases/errors/email-already-sent-error';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
        });

        const { email, name, password } = createUserBodySchema.parse(
            request.body
        );

        const createUserUseCase = makeRegisterUseCase();
        await createUserUseCase.execute({ email, name, password });
        return reply.status(201).send();
    } catch (error) {
        if (error instanceof UserAlreadyExistError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof EmailAlreadySentError) {
            return reply.status(409).send({ message: error.message });
        }

        throw error;
    }
}
