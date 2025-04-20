import { FastifyReply, FastifyRequest } from 'fastify';
import { string, z } from 'zod';
import { makeForgotPasswordUseCase } from '@/application/use-cases/factory/make-forgot-password-use-case';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';
import { UnableSendEmailError } from '@/application/use-cases/errors/unable-send-email-error';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';

export async function verifyForgotPassword(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const createUserBodySchema = z.object({
            email: z.string().email().nonempty(),
        });

        const { email } = createUserBodySchema.parse(request.body);

        const verifyUserForgotPasswordUseCase = makeForgotPasswordUseCase();
        await verifyUserForgotPasswordUseCase.execute({
            email,
        });
        return reply
            .status(200)
            .send({ message: 'Verify your e-mail in 30 minutes!' });
    } catch (error) {
        if (error instanceof UserNotValidatedError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof ResourceNotFoundError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof UnableSendEmailError) {
            return reply.status(409).send({ message: error.message });
        }

        throw error;
    }
}
