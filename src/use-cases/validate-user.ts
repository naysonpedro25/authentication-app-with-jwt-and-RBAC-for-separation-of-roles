import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { InvalidCredentials } from './errors/invalid-credentials-error';
import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';

interface ValidateUserUseCaseRequest {
    email: string;
}

interface ValidateUserUseCaseResponse {
    user: User;
}

export class ValidateUserUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        email,
    }: ValidateUserUseCaseRequest): Promise<ValidateUserUseCaseResponse> {
        const userNotValidated = await this.userRepository.findByEmail(email);
        if (!userNotValidated) {
            throw new InvalidCredentials();
        }
        if (userNotValidated.validated_at) {
            throw new UserAlreadyValidatedError();
        }
        const user = await this.userRepository.validate(email, new Date());
        return {
            user,
        };
    }
}
