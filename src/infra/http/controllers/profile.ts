import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from '@/application/use-cases/factory/make-get-user-profile-use-case';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';
import { User } from '@prisma/client';

type UserFilter = Omit<User, 'password_hash' | 'vef'>;
export async function profile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getProfileUseCase = makeGetUserProfileUseCase();
        const { user } = await getProfileUseCase.execute({
            userId: request.user.sub,
        });
        const {
            password_hash,
            validated_at,
            verification_token_expires_at,
            verification_token,
            ...userFiltered
        } = user;

        return reply.status(200).send({ user: userFiltered });
    } catch (error) {
        if (error instanceof InvalidCredentials) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
