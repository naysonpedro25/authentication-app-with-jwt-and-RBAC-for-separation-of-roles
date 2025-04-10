import { UserAlreadyExistError } from '@/application/use-cases/errors/user-already-exist-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { string, z } from 'zod';
import { makeRegisterUseCase } from '@/application/use-cases/factory/make-register-use-case';
import { makeChangeUserPasswordUsecCase } from '@/application/use-cases/factory/make-change-user-password-use-case';
import { makeVerifyUserByEmailUseCase } from '@/application/use-cases/factory/make-verify-user-by-email';
import { makeVerifyUserForgotPasswordUseCase } from '@/application/use-cases/factory/make-verify-user-forgot-password-use-case';

export async function verifyForgotPassword(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const createUserBodySchema = z.object({
            email: z.string().email(),
        });

        const { email } = createUserBodySchema.parse(request.body);

        const changePasswordUseCase = makeVerifyUserForgotPasswordUseCase();
        const { token } = await changePasswordUseCase.execute({ email });
        return reply
            .setCookie('verifyForChangePasswordToken', token, {
                secure: true,
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 30,
            })
            .status(200)
            .send({ message: 'Verify you e-email in 30 minutes!' });
    } catch (error) {
        if (error instanceof UserAlreadyExistError) {
            return reply.status(409).send({ message: error.message });
        }

        throw error;
    }
}
