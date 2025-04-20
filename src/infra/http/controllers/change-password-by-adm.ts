import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeChangeUserPasswordByAdmUsecCase } from '@/application/use-cases/factory/make-change-user-password-by-adm-use-case';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';

export async function changePasswordByAdm(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const changePasswordParamsSchema = z.object({
            id: z.string().uuid(),
        });
        const changePasswordBodySchema = z.object({
            newPassword: z.string(),
        });
        const { id } = changePasswordParamsSchema.parse(request.params);
        const { newPassword } = changePasswordBodySchema.parse(request.body);

        const changePasswordUseCase = makeChangeUserPasswordByAdmUsecCase();
        await changePasswordUseCase.execute({
            newPassword,
            userId: id,
        });

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
