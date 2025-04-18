import { FastifyReply, FastifyRequest } from 'fastify';
import { makeValidateUserUseCase } from '@/application/use-cases/factory/make-validate-user-use-case';
import { z } from 'zod';
import { UserAlreadyValidatedError } from '@/application/use-cases/errors/user-already-velidated-error';
import { VerificationTokenInvalidError } from '@/application/use-cases/errors/verification-token-invalid-error';
export async function validate(request: FastifyRequest, reply: FastifyReply) {
    try {
        const validateQuerySchema = z.object({
            token: z.string(),
        });

        const { token } = validateQuerySchema.parse(request.query);

        const validateUserUseCase = makeValidateUserUseCase();

        await validateUserUseCase.execute({ token });

        return reply.status(200).send();
    } catch (error) {
        if (error instanceof VerificationTokenInvalidError) {
            return reply.status(409).send({ message: error.message });
        }
        if (error instanceof UserAlreadyValidatedError) {
            return reply.status(409).send({ message: error.message });
        }
        throw error;
    }
}
