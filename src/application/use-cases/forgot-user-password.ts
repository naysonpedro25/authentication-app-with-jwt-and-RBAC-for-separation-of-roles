import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import bcrypt, { hash, compare } from 'bcryptjs';
import { InvalidCredentials } from './errors/invalid-credentials-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';

interface ForgotUserPasswordUseCaseRequest {
    email: string;
    newPassword: string;
}

interface ForgotUserPasswordUseCaseResponse {
    user: User;
}

export class ForgotUserPasswordUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        email,
        newPassword,
    }: ForgotUserPasswordUseCaseRequest): Promise<ForgotUserPasswordUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new ResourceNotFoundError();
        }
        if (!user.validated_at) {
            throw new UserNotValidatedError();
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
