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
            token: z.string(),
            email: z.string().email(),
            newPassword: z.string(),
        });

        const forgotPasswordCookieSchema = z.object({
            verifyForChangePasswordToken: z.string(),
        });
        const { token, email, newPassword } = forgotPasswordBodySchema.parse(
            request.body
        );

        const { verifyForChangePasswordToken } =
            forgotPasswordCookieSchema.parse(request.cookies);

        const forgotPasswordUseCase = makeForgotPasswordUseCase();

        if (!verifyForChangePasswordToken) {
            return reply.status(409).send({ message: 'Verify token expired' });
        }

        if (!token || token !== verifyForChangePasswordToken) {
            return reply.status(409).send({ message: 'Invalid verify token' });
        }
        await forgotPasswordUseCase.execute({
            email,
            newPassword,
        });

        return reply
            .clearCookie('verifyForChangePasswordToken')
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
