import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import bcrypt, { compare } from 'bcryptjs';
import { ValidateUserUseCase } from '@/application/use-cases/validate-user';
import { UserAlreadyValidatedError } from '@/application/use-cases/errors/user-already-velidated-error';
import { randomUUID } from 'node:crypto';

describe('Validate use case', () => {
    let sut: ValidateUserUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new ValidateUserUseCase(inMemoryRepository);
    });
    test('should be able validate a user', async () => {
        const { id } = await inMemoryRepository.create({
            name: 'name-test',
            email: 'email-test',
            password_hash: await bcrypt.hash('123456', 6),
            validated_at: null,
        });

        const EXPIRES_AFTER_30_MINUTES = new Date(Date.now() + 1000 * 60 * 30);
        const token = randomUUID();
        await inMemoryRepository.setVerificationToken(
            id,
            token,
            EXPIRES_AFTER_30_MINUTES
        );

        const { user } = await sut.execute({ token });

        expect(user.validated_at).toEqual(expect.any(Date));
    });
    test('should not be able validate a user already validated', async () => {
        const { id } = await inMemoryRepository.create({
            name: 'name-test',
            email: 'email-test',
            password_hash: await bcrypt.hash('123456', 6),
            validated_at: new Date(),
        });

        const EXPIRES_AFTER_30_MINUTES = new Date(Date.now() + 1000 * 60 * 30);
        const token = randomUUID();
        await inMemoryRepository.setVerificationToken(
            id,
            token,
            EXPIRES_AFTER_30_MINUTES
        );

        await expect(sut.execute({ token })).rejects.toBeInstanceOf(
            UserAlreadyValidatedError
        );
    });
});
