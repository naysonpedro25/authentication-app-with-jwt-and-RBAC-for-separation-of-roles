import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { UserAlreadyExistError } from './errors/user-already-exist-error';

// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Register use case', () => {
    let sut: RegisterUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new RegisterUseCase(inMemoryRepository);
    });
    test('should be able regiser a user', async () => {
        const { user } = await sut.execute({
            name: 'name-test',
            email: 'email-test',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
        expect(user).toEqual(
            expect.objectContaining({
                name: 'name-test',
            })
        );
    });

    test('should be password hashed in the register', async () => {
        const { user } = await sut.execute({
            name: 'name-test',
            email: 'email-test',
            password: '123456',
        });
        const comparedPasswords = await compare('123456', user.password_hash);

        expect(comparedPasswords).toEqual(true);
    });

    test('should not be able register with same email', async () => {
        await sut.execute({
            name: 'name-test',
            email: 'email-test',
            password: '123456',
        });

        await expect(
            sut.execute({
                name: 'name-test',
                email: 'email-test',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistError);
    });
});
