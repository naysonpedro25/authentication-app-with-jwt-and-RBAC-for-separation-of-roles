import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { UserAlreadyExistError } from './errors/user-already-exist-error';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseRequest {
    userId: string;
}

interface GetUserProfileUseCaseResponse {
    user: User;
}

export class GetUserProfileUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        userId,
    }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new ResourceNotFoundError();
        }
        return {
            user,
        };
    }
}
