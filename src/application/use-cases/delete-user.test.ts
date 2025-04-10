import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import { DeleteUserUseCase } from './delete-user';
import { hash } from 'bcryptjs';
// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Register use case', () => {
    let sut: DeleteUserUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new DeleteUserUseCase(inMemoryRepository);
    });
    test('should be able varify a user', async () => {
        const userCreated = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            userId: userCreated.id,
            password: '123456',
        });

        expect(inMemoryRepository.data).toEqual([]);
        expect(user).include(inMemoryRepository.data);
    });
});
