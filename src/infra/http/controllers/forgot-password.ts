import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeValidateUserUseCase } from '@/application/use-cases/factory/make-validate-user-use-case';
import { z } from 'zod';
import { UserAlreadyValidatedError } from '@/application/use-cases/errors/user-already-velidated-error';
import { makeChangeUserPasswordUsecCase } from '@/application/use-cases/factory/make-change-user-password-use-case';
import { makeVerifyUserForgotPasswordUseCase } from '@/application/use-cases/factory/make-verify-user-forgot-password-use-case';
import { makeForgotPasswordUseCase } from '@/application/use-cases/factory/make-forgot-password-use-case';
export async function forgotPassword(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const forgotPasswordBodySchema = z.object({
            newPassword: z.string().min(8).nonempty(),
        });
        const forgotPasswordQuerySchema = z.object({
            token: z.string().nonempty(),
        });

        const { newPassword } = forgotPasswordBodySchema.parse(request.body);
        const { token } = forgotPasswordQuerySchema.parse(request.query);

        const forgotPasswordUseCase = makeForgotPasswordUseCase();

        await forgotPasswordUseCase.execute({
            token,
            newPassword,
        });

        return reply
            .status(200)
            .send({ message: 'Password changed successfully' });
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
