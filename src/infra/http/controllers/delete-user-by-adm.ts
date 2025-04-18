import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteUserUseCase } from '@/application/use-cases/factory/make-delete-user-use-case';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
export async function deleteUserByAdm(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const deleteBodySchema = z.object({
            password: z.string(),
        });

        const deleteParamsSchema = z.object({
            id: z.string(),
        });

        const { id } = deleteParamsSchema.parse(request.params);
        const { password } = deleteBodySchema.parse(request.body);

        const deleteUserUseCase = makeDeleteUserUseCase();

        await deleteUserUseCase.execute({ userId: id, password });

        return reply.status(200).send();
    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof InvalidCredentials) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
