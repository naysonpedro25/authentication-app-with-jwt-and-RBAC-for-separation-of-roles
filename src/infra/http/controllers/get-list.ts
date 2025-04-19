import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from '@/application/use-cases/factory/make-get-user-profile-use-case';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import { makeGetListUserUseCase } from '@/application/use-cases/factory/make-get-list-users-use-case';
import { z } from 'zod';

export async function getList(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getListQuerySchema = z.object({
            page: z.coerce.number().min(1),
        });

        const { page } = getListQuerySchema.parse(request.query);

        const getListUserUseCase = makeGetListUserUseCase();
        const { users } = await getListUserUseCase.execute({ page });
        const mappedUsers = users.map(
            ({
                password_hash,
                validated_at,
                verification_token_expires_at,
                verification_token,
                ...rest
            }) => rest
        );
        return reply.status(200).send({ page, users: mappedUsers });
    } catch (error) {
        throw error;
    }
}
