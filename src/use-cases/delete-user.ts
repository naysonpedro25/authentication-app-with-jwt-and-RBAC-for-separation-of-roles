import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface DeleteUserUseCaseRequest {
    userId: string;
}

interface DeleteUserUseCaseResponse {
    user: User;
}

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        userId,
    }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
        const deletedUser = await this.userRepository.delete(userId);

        if (!deletedUser) {
            throw new ResourceNotFoundError();
        }
        return {
            user: deletedUser,
        };
    }
}
