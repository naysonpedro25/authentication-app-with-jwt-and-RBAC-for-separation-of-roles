import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import bcrypt from 'bcryptjs';
import { InvalidCredentials } from './errors/invalid-credentials-error';
interface DeleteUserUseCaseRequest {
    userId: string;
    password: string;
}

interface DeleteUserUseCaseResponse {
    user: User;
}

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        userId,
        password,
    }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        const matchPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!matchPassword) {
            throw new InvalidCredentials();
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
