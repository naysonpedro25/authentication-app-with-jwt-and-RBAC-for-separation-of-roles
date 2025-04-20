import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { hash, compare } from 'bcryptjs';

import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ChangeUserPasswordByAdmUseCaseRequest {
    userId: string;
    newPassword: string;
}

interface ChangeUserPasswordByAdmUseCaseResponse {
    user: User;
}

export class ChangeUserPasswordByAdmUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        userId,
        newPassword,
    }: ChangeUserPasswordByAdmUseCaseRequest): Promise<ChangeUserPasswordByAdmUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
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
