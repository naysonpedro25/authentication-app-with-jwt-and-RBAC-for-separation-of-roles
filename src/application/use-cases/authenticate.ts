import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { compare } from 'bcryptjs';
import { InvalidCredentials } from './errors/invalid-credentials-error';
import { UserNotValidatedError } from './errors/user-not-validated-error';

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse {
    user: User;
}

export class AuthenticateUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const userAlreadyExist = await this.userRepository.findByEmail(email);

        if (!userAlreadyExist) {
            throw new InvalidCredentials();
        }

        if (!userAlreadyExist.validated_at) {
            throw new UserNotValidatedError();
        }

        const passwordsIsEquals = await compare(
            password,
            userAlreadyExist.password_hash
        );

        if (!passwordsIsEquals) {
            throw new InvalidCredentials();
        }

        return {
            user: userAlreadyExist,
        };
    }
}
