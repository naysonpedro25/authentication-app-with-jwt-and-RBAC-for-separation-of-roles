import { Prisma, User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { prisma } from '../lib/prisma';

export class PrismaUserRepositoryImp implements UserRepositoryInterface {
    async create({
        email,
        name,
        password_hash,
    }: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data: {
                name,
                email,
                password_hash,
            },
        });
    }
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findById(userId: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    async fetchMany(page: number): Promise<User[]> {
        return prisma.user.findMany({
            take: 15,
            skip: (page - 1) * 15,
        });
    }

    async delete(userId: string): Promise<User | null> {
        return prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }

    async changePassword(userId: string, passwordHash: string): Promise<User> {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password_hash: passwordHash,
            },
        });
    }

    async validate(email: string, date: Date): Promise<User> {
        return prisma.user.update({
            where: {
                email,
            },
            data: {
                validated_at: date,
            },
        });
    }

    async deleteUnverified(): Promise<void> {
        await prisma.user.deleteMany({
            where: {
                validated_at: null,
                created_at: {
                    lt: new Date(Date.now() - 1000 * 60 * 30),
                },
            },
        });
    }
}
