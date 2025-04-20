import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect, vi } from 'vitest';
import { hash } from 'bcryptjs';
import { EmailService } from '@/domain/services/email-service-interface';
import { ForgotPasswordUseCase } from '@/application/use-cases/forgot-password';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';

describe('Verify user forgot password use case', () => {
    let sut: ForgotPasswordUseCase;
    let inMemoryRepository: InMemoryUserRepository;
    let emailService: EmailService;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        emailService = {
            sendVerificationEmailForValidate: vi.fn(),
            sendVerificationEmailForChangePassword: vi.fn(),
        };
        sut = new ForgotPasswordUseCase(inMemoryRepository, emailService);
    });
    test('should be able generate a token and send verification email', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'test@gmail.com',
            password_hash: await hash('123456', 6),
            validated_at: new Date(),
        });

        const mockSendVerificationForgotPassword = vi
            .mocked(emailService.sendVerificationEmailForChangePassword)
            .mockResolvedValue(undefined);

        const { token } = await sut.execute({
            email: 'test@gmail.com',
        });
        expect(token).toEqual(expect.any(String));
        expect(mockSendVerificationForgotPassword).toHaveBeenCalledWith(
            'test@gmail.com',
            token
        );
    });

    test('should not be able send email if user is not ready validated', async () => {
        const user = await inMemoryRepository.create({
            name: 'test-name',
            email: 'test@gmail.com',
            password_hash: await hash('123456', 6),
            validated_at: null,
        });

        await expect(
            sut.execute({
                email: 'test@gmail.com',
            })
        ).rejects.toBeInstanceOf(UserNotValidatedError);
    });
});
