import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import { makeDeleteUserByAdmUseCase } from '@/application/use-cases/factory/make-delete-user-by-adm-use-case';
import { UnableDeleteUserLogged } from '@/application/use-cases/errors/unable-delete-user-logged-error';
export async function deleteUserByAdm(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const deleteParamsSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = deleteParamsSchema.parse(request.params);

        if (id === request.user.sub) {
            return reply
                .status(400)
                .send({ message: new UnableDeleteUserLogged().message });
        }
        const deleteUserUseCase = makeDeleteUserByAdmUseCase();

        await deleteUserUseCase.execute({ userId: id });

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
