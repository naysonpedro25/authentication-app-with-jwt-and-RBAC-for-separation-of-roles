import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UserAlreadyValidatedError } from '@/application/use-cases/errors/user-already-velidated-error';
import { makeResetPasswordUseCase } from '@/application/use-cases/factory/make-reset-password-use-case';
import { VerificationTokenInvalidError } from '@/application/use-cases/errors/verification-token-invalid-error';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';
export async function resetPassword(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const resetPasswordBodySchema = z.object({
            newPassword: z.string().min(6).nonempty(),
        });
        const resetPasswordQuerySchema = z.object({
            token: z.string().nonempty(),
        });

        const { newPassword } = resetPasswordBodySchema.parse(request.body);
        const { token } = resetPasswordQuerySchema.parse(request.query);

        const forgotPasswordUseCase = makeResetPasswordUseCase();

        await forgotPasswordUseCase.execute({
            token,
            newPassword,
        });

        return reply
            .status(200)
            .send({ message: 'Password changed successfully' });
    } catch (error) {
        if (error instanceof UserNotValidatedError) {
            return reply.status(403).send({ message: error.message });
        }
        if (error instanceof VerificationTokenInvalidError) {
            return reply.status(403).send({ message: error.message });
        }
        throw error;
    }
}
