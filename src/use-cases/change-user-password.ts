import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { hash, compare } from 'bcryptjs';
import { InvalidCredentials } from './errors/invalid-credentials-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ChangeUserPasswordUseCaseRequest {
    userId: string;
    password: string;
    newPassword: string;
}

interface ChangeUserPasswordUseCaseResponse {
    user: User;
}

export class ChangeUserPasswordUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        userId,
        newPassword,
        password,
    }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }
        const isEqualsPassword = await compare(password, user.password_hash);

        if (!isEqualsPassword) {
            throw new InvalidCredentials();
        }

        const newPasswordHash = await hash(newPassword, 6);
        const userWithNewPassword = await this.userRepository.changePassword(
            userId,
            newPasswordHash
        );
        return {
            user: userWithNewPassword,
        };
    }
}
