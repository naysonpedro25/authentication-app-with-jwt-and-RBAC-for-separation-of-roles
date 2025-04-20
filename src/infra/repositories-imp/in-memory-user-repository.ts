import { Prisma, ROLE, User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { ResourceNotFoundError } from '@/application/use-cases/errors/resource-not-found-error';
import { InvalidCredentials } from '@/application/use-cases/errors/invalid-credentials-error';

export class InMemoryUserRepository implements UserRepositoryInterface {
    data: User[] = [];
    async create({
        name,
        email,
        password_hash,
        id,
        role,
        validated_at,
        verification_token,
        verification_token_expires_at,
    }: Prisma.UserCreateInput): Promise<User> {
        const user: User = {
            id: id ?? 'user-id',
            name,
            email,
            password_hash,
            validated_at: validated_at ? new Date() : null,
            role: role ?? 'USER',
            created_at: new Date(),
            verification_token: verification_token ?? null,
            verification_token_expires_at: verification_token_expires_at
                ? new Date()
                : null,
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
    async validate(id: string, date: Date): Promise<User> {
        const index = this.data.findIndex((value) => value.id === id);
        this.data[index].validated_at = date;
        this.data[index].verification_token = null;
        this.data[index].verification_token_expires_at = null;
        return this.data[index];
    }

    async deleteUnverified(): Promise<void> {
        this.data.filter((value) => value.validated_at !== null);
    }
    async findByToken(token: string): Promise<User | null> {
        const user = this.data.find(
            (value) => value.verification_token === token
        );
        return user ?? null;
    }
    async setVerificationToken(
        userId: string,
        token: string,
        expireAt: Date
    ): Promise<User> {
        const index = this.data.findIndex((value) => value.id === userId);
        this.data[index].verification_token = token;
        this.data[index].verification_token_expires_at = expireAt;
        return this.data[index];
    }
    async changeRole(userId: string, role: ROLE): Promise<User> {
        const index = this.data.findIndex((value) => value.id === userId);
        this.data[index].role = role;
        return this.data[index];
    }
}
