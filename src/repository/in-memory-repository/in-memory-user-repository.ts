import { Prisma, User } from '@prisma/client';
import { UserRepositoryInterface } from '../interfaces/user-repository-interface';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { InvalidCredentials } from '@/use-cases/errors/invalid-credentials-error';

export class InMemoryUserRepository implements UserRepositoryInterface {
    data: User[] = [];
    async create({
        name,
        email,
        password_hash,
        id,
        role,
        validated_at,
    }: Prisma.UserCreateInput): Promise<User> {
        const user: User = {
            id: id ?? 'user-id',
            name,
            email,
            password_hash,
            validated_at: validated_at ? new Date() : null,
            role: role ?? 'USER',
            created_at: new Date(),
        };

        this.data.push(user);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = this.data.find((value) => value.email === email);
        return user ?? null;
    }

    async fetchMany(page: number): Promise<User[]> {
        return this.data.slice((page - 1) * 15, page * 15);
    }

    async delete(userId: string): Promise<User | null> {
        const userDeleted = this.data.find((value) => value.id === userId);
        if (!userDeleted) {
            return null;
        }
        this.data = this.data.filter((value) => value.id !== userId);
        return userDeleted;
    }

    async findById(userId: string): Promise<User | null> {
        const user = this.data.find((value) => value.id === userId);
        return user ?? null;
    }
    async changePassword(userId: string, passwordHash: string): Promise<User> {
        const userIndex = this.data.findIndex((value) => value.id === userId);
        if (userIndex <= -1) {
            throw new ResourceNotFoundError();
        }
        this.data[userIndex].password_hash = passwordHash;
        return this.data[userIndex];
    }
    async validate(email: string, date: Date): Promise<User> {
        const index = this.data.findIndex((value) => value.email === email);
        this.data[index].validated_at = date;
        return this.data[index];
    }
}
