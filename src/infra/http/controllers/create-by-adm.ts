import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { EmailAlreadySentError } from '@/application/use-cases/errors/email-already-sent-error';
import { makeCreateUserByAdmUseCase } from '@/application/use-cases/factory/make-create-user-by-adm-use-case';

export async function createByAdm(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const createUserBodySchema = z.object({
            name: z.string().max(20),
            email: z.string().email(),
            password: z.string().min(6),
            role: z.enum(['USER', 'ADMIN']),
        });

        const { email, name, password } = createUserBodySchema.parse(
            request.body
        );

        const createUserUseCase = makeCreateUserByAdmUseCase();
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
