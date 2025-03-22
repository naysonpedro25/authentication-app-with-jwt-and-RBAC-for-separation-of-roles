import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';
import { UserAlreadyExistError } from './errors/user-already-exist-error';
import { randomUUID } from 'node:crypto';
import { sendVerificationEmail } from './util/sendVerificationEmail';
import { UnableSendEmailError } from './errors/unable-send-email-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';

interface VerifyUserByEmailUseCaseRequest {
    email: string;
}

interface VerifyUserByEmailUseCaseResponse {
    token: string;
}

export class VerifyUserByEmailUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        email,
    }: VerifyUserByEmailUseCaseRequest): Promise<VerifyUserByEmailUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        if (user.validated_at) {
            throw new UserAlreadyValidatedError();
        }

        const token = randomUUID();
        try {
            await sendVerificationEmail(email, token);
        } catch (error) {
            console.error(error);
            throw new UnableSendEmailError();
        }
        return {
            token,
        };
    }
}
