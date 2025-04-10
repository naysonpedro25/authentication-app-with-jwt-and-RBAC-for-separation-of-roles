import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Get User Profile use case', () => {
    let sut: GetUserProfileUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();
        sut = new GetUserProfileUseCase(inMemoryRepository);
    });
    test('should be able get profile user', async () => {
        const userCreated = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
        });

        const { user } = await sut.execute({
            userId: userCreated.id,
        });

        expect(user.id).toEqual(userCreated.id);
        expect(user.name).toEqual(expect.any(String));
    });

    test('should not be able get profile user with wrong id', async () => {
        const userCreated = await inMemoryRepository.create({
            name: 'test-name',
            email: 'email-test',
            password_hash: await hash('123456', 6),
        });

        await expect(
            sut.execute({
                userId: 'wrong id',
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
