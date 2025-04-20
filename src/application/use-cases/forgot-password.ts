import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { randomUUID } from 'node:crypto';
import { UnableSendEmailError } from './errors/unable-send-email-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { EmailService } from '@/domain/services/email-service-interface';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';
interface ForgotPasswordUseCaseRequest {
    email: string;
}

interface ForgotPasswordUseCaseResponse {
    token: string;
}

export class ForgotPasswordUseCase {
    constructor(
        private userRepository: UserRepositoryInterface,
        private emailService: EmailService
    ) {}
    async execute({
        email,
    }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new ResourceNotFoundError();
        }

        if (!user.validated_at) {
            throw new UserNotValidatedError();
        }
        const EXPIRES_AFTER_30_MINUTES = new Date(Date.now() + 1000 * 60 * 30);
        const token = randomUUID();

        await this.userRepository.setVerificationToken(
            user.id,
            token,
            EXPIRES_AFTER_30_MINUTES
        );
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
