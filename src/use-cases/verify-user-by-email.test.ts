import { InMemoryUserRepository } from '@/repository/in-memory-repository/in-memory-user-repository';
import { describe, test, beforeEach, expect, Mock, vi } from 'vitest';
import { VerifyUserByEmailUseCase } from './verify-user-by-email';
import { hash } from 'bcryptjs';
import { sendVerificationEmail } from './util/sendVerificationEmail';
import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';
import { UnableSendEmailError } from './errors/unable-send-email-error';

describe('Verify user by email use case', () => {
    let sut: VerifyUserByEmailUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    vi.mock('./util/sendVerificationEmail.ts', () => ({
        sendVerificationEmail: vi.fn(),
    }));

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new VerifyUserByEmailUseCase(inMemoryRepository);
    });
    test('should be able generate a token and send verification email', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'test@gmail.com',
            password_hash: await hash('123456', 6),
        });

        const mockSendVeriicationEmail = vi
            .mocked(sendVerificationEmail)
            .mockResolvedValue(undefined); // faz com q a fun retorne uma promisse resolvida com retorno undefined

        const { token } = await sut.execute({
            email: 'test@gmail.com',
        });
        expect(token).toEqual(expect.any(String));
        expect(mockSendVeriicationEmail).toHaveBeenCalledWith(
            'test@gmail.com',
            token
        );
    });

    test('should not be able send email if user is realdy validated', async () => {
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
        vi.mocked(sendVerificationEmail).mockRejectedValue(
            new Error('error to send email: email not found')
        );
        await expect(
            sut.execute({ email: 'test@gmail.com' })
        ).rejects.toBeInstanceOf(UnableSendEmailError);
    });
});
