import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { UserAlreadyExistError } from './errors/user-already-exist-error';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User;
}

export class RegisterUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        name,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userAlreadyExist = await this.userRepository.findByEmail(email);

        if (userAlreadyExist) {
            throw new UserAlreadyExistError();
        }
        const password_hash = await hash(password, 6);

        const user = await this.userRepository.create({
            name,
            email,
            password_hash,
        });

        return {
            user,
        };
    }
}
