import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { randomUUID } from 'node:crypto';
import { UnableSendEmailError } from './errors/unable-send-email-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';
import { EmailService } from '@/domain/services/email-service-interface';
interface VerifyUserByEmailUseCaseRequest {
    email: string;
}

interface VerifyUserByEmailUseCaseResponse {
    token: string;
}

export class VerifyUserByEmailUseCase {
    constructor(
        private userRepository: UserRepositoryInterface,
        private emailService: EmailService
    ) {}
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
            const url = `http://localhost:3333/session/verify-email?token=${token}&email=${email}`;
            await this.emailService.sendVerificationEmailForValidate(
                email,
                token
            );
        } catch (error) {
            console.error(error);
            throw new UnableSendEmailError();
        }
        return {
            token,
        };
    }
}
