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
        const user = await this.userRepository.findByToken(token);

        if (!user) {
            throw new VerificationTokenInvalidError();
        }
        if (!user.validated_at) {
            throw new UserNotValidatedError();
        }
        if (!user.verification_token || !user.verification_token_expires_at) {
            throw new VerificationTokenInvalidError();
        }
        if (user.verification_token_expires_at.getTime() < Date.now()) {
        }
        const passwordHash = await bcrypt.hash(newPassword, 6);
        const userWithNewPassword = await this.userRepository.changePassword(
            user.id,
            passwordHash
        );
        return {
            user: userWithNewPassword,
        };
    }
}
