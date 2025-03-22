import { InMemoryUserRepository } from '@/repository/in-memory-repository/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import { ChangeUserPasswordUseCase } from './change-user-password';
import { compare, hash } from 'bcryptjs';
// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Change user password use case', () => {
    let sut: ChangeUserPasswordUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new ChangeUserPasswordUseCase(inMemoryRepository);
    });
    test('should be able change user password', async () => {
        const userCreated = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
        });

        const oldPassword = userCreated.password_hash;

        const { user } = await sut.execute({
            userId: userCreated.id,
            password: '123456',
            newPassword: 'zépelin',
        });
        const isEqualsPasswords = await compare('zépelin', user.password_hash);
        expect(isEqualsPasswords).toEqual(true);
        expect(user.password_hash).not.toEqual(oldPassword);
    });
});
