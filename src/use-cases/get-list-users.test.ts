import { InMemoryUserRepository } from '@/repository/in-memory-repository/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import { GetListUserUseCase } from './get-list-users';
import { hash } from 'bcryptjs';
// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Register use case', () => {
    let sut: GetListUserUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new GetListUserUseCase(inMemoryRepository);
    });
    test('should be able varify a user', async () => {
        for (let i = 1; i <= 15; i++) {
            await inMemoryRepository.create({
                name: 'test-name' + i,
                email: 'email-test' + i,
                password_hash: await hash('123456', 6),
            });
        }

        const user = await inMemoryRepository.create({
            name: 'test-name-16',
            email: 'email-test-16',
            password_hash: await hash('123456', 6),
        });

        const { users } = await sut.execute({ page: 2 });
        expect(users[0].email).toEqual('email-test-16');
    });
});
