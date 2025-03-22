import { Prisma, User } from '@prisma/client';
import { UserRepositoryInterface } from './interfaces/user-repository-interface';
import { prisma } from '@/lib/prisma';

export class PrismaUserRepositoryImp implements UserRepositoryInterface {
    async create({
        email,
        name,
        password_hash,
    }: Prisma.UserCreateInput): Promise<User> {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
            },
        });
        return user;
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async findById(userId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        return user;
    }

    async fetchMany(page: number): Promise<User[]> {
        const users = await prisma.user.findMany({
            take: 15,
            skip: page - 1 * 15,
        });

        return users;
    }

    async delete(userId: string): Promise<User | null> {
        const user = await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        return user;
    }

    async changePassword(userId: string, passwordHash: string): Promise<User> {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password_hash: passwordHash,
            },
        });

        return user;
    }

    async validate(email: string, date: Date): Promise<User> {
        const user = prisma.user.update({
            where: {
                email,
            },
            data: {
                validated_at: date,
            },
        });
        return user;
    }
}
