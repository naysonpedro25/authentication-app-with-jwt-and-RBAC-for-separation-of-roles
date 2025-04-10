import { describe, test, beforeEach, expect } from 'vitest';
import { compare, hash } from 'bcryptjs';
import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { ForgotUserPasswordUseCase } from '@/application/use-cases/forgot-user-password';
// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Forgot user password use case', () => {
    let sut: ForgotUserPasswordUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new ForgotUserPasswordUseCase(inMemoryRepository);
    });
    test('should be able reset user password', async () => {
        const userCreated = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
            validated_at: new Date(),
        });

        const oldPassword = userCreated.password_hash;

        const { user } = await sut.execute({
            email: 'email-test',
            newPassword: 'testPassword123',
        });

        const isEqualsPasswords = await compare(
            'testPassword123',
            user.password_hash
        );
        expect(isEqualsPasswords).toEqual(true);
        expect(user.password_hash).not.toEqual(oldPassword);
    });
});
