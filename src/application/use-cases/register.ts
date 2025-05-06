import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { UserAlreadyExistError } from './errors/user-already-exist-error';
import { hash } from 'bcryptjs';
import { EmailAlreadySentError } from '@/application/use-cases/errors/email-already-sent-error';
import { randomUUID } from 'node:crypto';
import { UnableSendEmailError } from '@/application/use-cases/errors/unable-send-email-error';
import { EmailService } from '@/domain/services/email-service-interface';

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User;
}

export class RegisterUseCase {
    constructor(
        private userRepository: UserRepositoryInterface,
        private emailService: EmailService
    ) {}
    async execute({
        name,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userAlreadyExist = await this.userRepository.findByEmail(email);

        if (userAlreadyExist && userAlreadyExist.validated_at) {
            throw new UserAlreadyExistError();
        }

        if (userAlreadyExist) {
            throw new EmailAlreadySentError();
        }

        const token = randomUUID();

        try {
            await this.emailService.sendVerificationEmailForValidate(
                email,
                token
            );
        } catch (error) {
            console.error(error);
            throw new UnableSendEmailError();
        }

        const password_hash = await hash(password, 6);

        const EXPIRES_AFTER_30_MINUTES = new Date(Date.now() + 1000 * 60 * 30);

        const { id } = await this.userRepository.create({
            name,
            email,
            password_hash,
        });
        const user = await this.userRepository.setVerificationToken(
            id,
            token,
            EXPIRES_AFTER_30_MINUTES
        );

        return {
            user,
        };
    }
}
