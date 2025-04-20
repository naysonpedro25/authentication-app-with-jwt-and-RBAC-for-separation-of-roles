import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
interface DeleteUserUseCaseRequest {
    userId: string;
}

interface DeleteUserUseCaseResponse {
    user: User;
}

export class DeleteUserByAdmUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        userId,
    }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const deletedUser = await this.userRepository.delete(userId);

        if (!deletedUser) {
            throw new ResourceNotFoundError();
        }
        return {
            user: deletedUser,
        };
    }
}
