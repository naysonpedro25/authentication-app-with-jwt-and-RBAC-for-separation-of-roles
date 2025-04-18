import { describe, test, beforeEach, expect } from 'vitest';
import { compare, hash } from 'bcryptjs';
import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { ForgotUserPasswordUseCase } from '@/application/use-cases/forgot-user-password';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { UserNotValidatedError } from '@/application/use-cases/errors/user-not-validated-error';
import { randomUUID } from 'crypto';
import { VerificationTokenInvalidError } from './errors/verification-token-invalid-error';
// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Forgot user password use case', () => {
    let sut: ForgotUserPasswordUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new ForgotUserPasswordUseCase(inMemoryRepository);
    });
    test('should be able reset user password', async () => {
        const { id, password_hash } = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
            validated_at: new Date(),
        });

        const EXPIRES_AFTER_30_MINUTES = new Date(Date.now() + 1000 * 60 * 30);
        const token = randomUUID();
        await inMemoryRepository.setVerificationToken(
            id,
            token,
            EXPIRES_AFTER_30_MINUTES
        );

        const { user } = await sut.execute({
            token,
            newPassword: 'testPassword123',
        });

        const isEqualsPasswords = await compare(
            'testPassword123',
            user.password_hash
        );
        expect(isEqualsPasswords).toEqual(true);
        expect(user.password_hash).not.toEqual(password_hash);
    });
    test('should not be able try reset password with not valid verification token ', async () => {
        await expect(
            sut.execute({
                token: 'false-token',
                newPassword: 'testPassword123',
            })
        ).rejects.toBeInstanceOf(VerificationTokenInvalidError);
    });
    test('should not be able try reset password of not validated user ', async () => {
        const { id } = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
            validated_at: null,
        });
        const EXPIRES_AFTER_30_MINUTES = new Date(Date.now() + 1000 * 60 * 30);
        const token = randomUUID();
        await inMemoryRepository.setVerificationToken(
            id,
            token,
            EXPIRES_AFTER_30_MINUTES
        );

        await expect(
            sut.execute({
                token,
                newPassword: 'testPassword123',
            })
        ).rejects.toBeInstanceOf(UserNotValidatedError);
    });
});
