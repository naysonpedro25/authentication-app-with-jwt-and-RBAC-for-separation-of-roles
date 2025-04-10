import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeValidateUserUseCase } from '@/application/use-cases/factory/make-validate-user-use-case';
import { z } from 'zod';
import { UserAlreadyValidatedError } from '@/application/use-cases/errors/user-already-velidated-error';
export async function register(request: FastifyRequest, reply: FastifyReply) {
    try {
        const regiserBodySchema = z.object({
            token: z.string(),
            email: z.string().email(),
        });

        const verifyUserEmailCookieSchema = z.object({
            verifyEmailToken: z.string(),
        });
        const { token, email } = regiserBodySchema.parse(request.body);

        const { verifyEmailToken } = verifyUserEmailCookieSchema.parse(
            request.cookies
        );

        const validateUserUseCase = makeValidateUserUseCase();

        if (!verifyEmailToken) {
            return reply.status(409).send({ message: 'Verify token expired' });
        }

        if (!token || token !== verifyEmailToken) {
            return reply.status(409).send({ message: 'Invalid verify token' });
        }

        await validateUserUseCase.execute({ email });

        return reply.clearCookie('verifyEmailToken').status(201).send();
    } catch (error) {
        if (error instanceof UserAlreadyExistError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof UserAlreadyValidatedError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
