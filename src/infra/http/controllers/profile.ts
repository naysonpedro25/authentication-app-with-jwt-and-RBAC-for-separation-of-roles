import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from '@/application/use-cases/factory/make-get-user-profile-use-case';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getProfileUseCase = makeGetUserProfileUseCase();
        const { user } = await getProfileUseCase.execute({
            userId: request.user.sub,
        });
        const { password_hash, ...userWithoutPassword } = user;

        return reply.status(200).send({ user: userWithoutPassword });
    } catch (error) {
        if (error instanceof InvalidCredentials) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
