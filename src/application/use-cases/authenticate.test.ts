import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentials } from './errors/invalid-credentials-error';
import { UserNotValidatedError } from './errors/user-not-validated-error';

// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Authenticate use case', () => {
    let sut: AuthenticateUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new AuthenticateUseCase(inMemoryRepository);
    });
    test('should be able authenticate a user', async () => {
        const userCreated = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
            validated_at: new Date(),
        });

        const { user } = await sut.execute({
            email: 'email-test',
            password: '123456',
        });

        expect(user.id).toEqual(userCreated.id);
    });

    test('should not be able authenticate with invalid email ', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: '123456',
        });

        await expect(
            sut.execute({
                email: 'invalid-email-test',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(InvalidCredentials);
    });

    test('should not be able authenticate with invalid password', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: '123456',
            validated_at: new Date(),
        });

        await expect(
            sut.execute({
                email: 'email-test',
                password: 'invalid-password-123456',
            })
        ).rejects.toBeInstanceOf(InvalidCredentials);
    });
    test('should not be able authenticate user not validated ', async () => {
        await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: '123456',
            validated_at: null,
        });

        await expect(
            sut.execute({
                email: 'email-test',
                password: 'invalid-password-123456',
            })
        ).rejects.toBeInstanceOf(UserNotValidatedError);
    });
});
