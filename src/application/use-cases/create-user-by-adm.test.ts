import { InMemoryUserRepository } from '@/infra/repositories-imp/in-memory-user-repository';
import { describe, test, beforeEach, expect, vi } from 'vitest';
import { compare } from 'bcryptjs';
import { UserAlreadyExistError } from './errors/user-already-exist-error';
import { EmailAlreadySentError } from './errors/email-already-sent-error';
import { CreateUserByAdmUseCase } from './creater-user-by-adm';

// espera-se que: seja possível criar um user,password esteja hasheada, não seja possível criar um 2 usuários com mesmo email,

describe('Create user by adm use case', () => {
    let sut: CreateUserByAdmUseCase;
    let inMemoryRepository: InMemoryUserRepository;

    beforeEach(() => {
        inMemoryRepository = new InMemoryUserRepository();

        sut = new CreateUserByAdmUseCase(inMemoryRepository);
    });

    test('should be able create a new user', async () => {
        const { user } = await sut.execute({
            name: 'name-test',
            email: 'email-test',
            password: '123456',
            role: 'ADM',
        });

        expect(user.id).toEqual(expect.any(String));
        expect(user).toEqual(
            expect.objectContaining({
                name: 'name-test',
            })
        );
        expect(user.validated_at).toEqual(null);
        expect(user.role).toEqual('ADM');
    });

    test('should be password hashed in the create user', async () => {
        const { user } = await sut.execute({
            name: 'name-test',
            email: 'email-test',
            password: '123456',
        });
        const comparedPasswords = await compare('123456', user.password_hash);

        expect(comparedPasswords).toEqual(true);
    });

    test('should not be able create user with same email', async () => {
        await inMemoryRepository.create({
            name: 'name-test',
            email: 'email-test',
            password_hash: '123456',
            validated_at: new Date(),
        });

        await expect(
            sut.execute({
                name: 'name-test',
                email: 'email-test',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistError);
    });

    test('should not be able retry create user not validate', async () => {
        await inMemoryRepository.create({
            name: 'name-test',
            email: 'email-test',
            password_hash: '123456',
        });

        await expect(
            sut.execute({
                name: 'name-test',
                email: 'email-test',
                password: '123456',
            })
        ).rejects.toBeInstanceOf(EmailAlreadySentError);
    });
});
