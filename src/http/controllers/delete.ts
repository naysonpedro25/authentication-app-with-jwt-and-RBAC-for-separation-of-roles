import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeValidateUserUseCase } from '@/use-cases/factory/make-validate-user-use-case';
import { z } from 'zod';
import { UserAlreadyValidatedError } from '@/use-cases/errors/user-already-velidated-error';
import { makeDeleteUserUseCase } from '@/use-cases/factory/make-delete-user-use-case';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
export async function register(request: FastifyRequest, reply: FastifyReply) {
    try {
        const deleteParamsSchema = z.object({
            userId: z.string(),
        });
        const deleteBodySchema = z.object({
            password: z.string(),
        });

        const { userId } = deleteParamsSchema.parse(request.params);
        const { password } = deleteBodySchema.parse(request.body);

        const deleteUserUseCase = makeDeleteUserUseCase();

        await deleteUserUseCase.execute({ userId, password });

        return reply.status(200).send();
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
