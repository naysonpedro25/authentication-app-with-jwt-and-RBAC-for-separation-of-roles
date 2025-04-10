import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect, vi } from 'vitest';
import { VerifyUserByEmailUseCase } from './verify-user-by-email';
import { hash } from 'bcryptjs';
import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';
import { UnableSendEmailError } from './errors/unable-send-email-error';
import { EmailService } from '@/domain/services/email-service-interface';
import { NodeMailerEmailServiceImp } from '@/infra/services/node-mailer-email-service-imp';

describe('Verify user by email use case', () => {
    let sut: VerifyUserByEmailUseCase;
    let inMemoryRepository: InMemoryUserRepository;
    let emailService: EmailService;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        emailService = {
            sendVerificationEmailForValidate: vi.fn(),
            sendVerificationEmailForChangePassword: vi.fn(),
        };
        sut = new VerifyUserByEmailUseCase(inMemoryRepository, emailService);
    });
    test('should be able generate a token and send verification email', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'test@gmail.com',
            password_hash: await hash('123456', 6),
        });

        const mockSendVerificationEmail = vi
            .mocked(emailService.sendVerificationEmailForValidate)
            .mockResolvedValue(undefined); // faz com q a fun retorne uma promisse resolvida com retorno undefined

        const { token } = await sut.execute({
            email: 'test@gmail.com',
        });
        expect(token).toEqual(expect.any(String));
        expect(mockSendVerificationEmail).toHaveBeenCalledWith(
            'test@gmail.com',
            token
        );
    });

    test('should not be able send email if user is ready validated', async () => {
        const user = await inMemoryRepository.create({
            name: 'test-name',
            email: 'test@gmail.com',
            password_hash: await hash('123456', 6),
            validated_at: new Date(),
        });

        await expect(sut.execute({ email: user.email })).rejects.toBeInstanceOf(
            UserAlreadyValidatedError
        );
    });

    test('should throw UnableSendEmailError if email sending fails', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'test@gmail.com',
            password_hash: await hash('123456', 6),
        });
        vi.mocked(
            emailService.sendVerificationEmailForValidate
        ).mockRejectedValue(new UnableSendEmailError());
        await expect(
            sut.execute({ email: 'test@gmail.com' })
        ).rejects.toBeInstanceOf(UnableSendEmailError);
    });
});
