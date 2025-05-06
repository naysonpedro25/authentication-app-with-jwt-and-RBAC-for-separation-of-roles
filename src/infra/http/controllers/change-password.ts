import { FastifyReply, FastifyRequest } from 'fastify';
import { object, z } from 'zod';
import { makeChangeUserPasswordUsecCase } from '@/application/use-cases/factory/make-change-user-password-use-case';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';

export async function changePassword(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const changePasswordBodySchema = z.object({
            password: z.string(),
            newPassword: z.string().min(6),
        });

        const id = request.user.sub;

        const { password, newPassword } = changePasswordBodySchema.parse(
            request.body
        );

        const changePasswordUseCase = makeChangeUserPasswordUsecCase();
        await changePasswordUseCase.execute({
            password,
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
