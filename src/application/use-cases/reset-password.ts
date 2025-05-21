import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import bcrypt from 'bcryptjs';

import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';
import { VerificationTokenInvalidError } from '@/application/use-cases/errors/verification-token-invalid-error';

interface ResetPasswordUseCaseRequest {
    token: string;
    newPassword: string;
}

interface ResetPasswordUseCaseResponse {
    user: User;
}

export class ResetPasswordUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        token,
        newPassword,
    }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
        const userForResetPassword =
            await this.userRepository.findByToken(token);

        if (!userForResetPassword) {
            throw new VerificationTokenInvalidError();
        }
        if (!userForResetPassword.validated_at) {
            throw new UserNotValidatedError();
        }
        if (
            !userForResetPassword.verification_token ||
            !userForResetPassword.verification_token_expires_at
        ) {
            throw new VerificationTokenInvalidError();
        }
        if (
            userForResetPassword.verification_token_expires_at.getTime() <
            Date.now()
        ) {
        }
        const passwordHash = await bcrypt.hash(newPassword, 6);
        await this.userRepository.changePassword(
            userForResetPassword.id,
            passwordHash
        );
        const user = await this.userRepository.clearVerificationToken(
            userForResetPassword.id
        );
        return {
            user,
        };
    }
}
