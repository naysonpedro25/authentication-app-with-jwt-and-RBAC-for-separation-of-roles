import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import bcrypt, { hash, compare } from 'bcryptjs';
import { InvalidCredentials } from './errors/invalid-credentials-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';
import { VerificationTokenInvalidError } from '@/application/use-cases/errors/verification-token-invalid-error';

interface ForgotUserPasswordUseCaseRequest {
    token: string;
    newPassword: string;
}

interface ForgotUserPasswordUseCaseResponse {
    user: User;
}

export class ForgotUserPasswordUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        token,
        newPassword,
    }: ForgotUserPasswordUseCaseRequest): Promise<ForgotUserPasswordUseCaseResponse> {
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
