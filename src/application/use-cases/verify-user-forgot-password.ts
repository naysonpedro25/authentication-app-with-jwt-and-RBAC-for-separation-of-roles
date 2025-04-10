import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { randomUUID } from 'node:crypto';
import { UnableSendEmailError } from './errors/unable-send-email-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';
import { EmailService } from '@/domain/services/email-service-interface';
interface VerifyUserForgotPasswordUseCaseRequest {
    email: string;
}

interface VerifyUserForgotPasswordUseCaseResponse {
    token: string;
}

export class VerifyUserForgotPasswordUseCase {
    constructor(
        private userRepository: UserRepositoryInterface,
        private emailService: EmailService
    ) {}
    async execute({
        email,
    }: VerifyUserForgotPasswordUseCaseRequest): Promise<VerifyUserForgotPasswordUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        if (!user.validated_at) {
            throw new ResourceNotFoundError();
        }

        const token = randomUUID();
        try {
            await this.emailService.sendVerificationEmailForChangePassword(
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
