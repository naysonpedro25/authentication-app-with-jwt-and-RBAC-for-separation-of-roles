import { Prisma, ROLE, User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { prisma } from '../lib/prisma';

export class PrismaUserRepositoryImp implements UserRepositoryInterface {
    async create({
        email,
        name,
        password_hash,
        validated_at,
        role,
    }: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                validated_at,
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
            orderBy: {
                created_at: 'asc',
            },
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

    async validate(id: string, date: Date): Promise<User> {
        return prisma.user.update({
            where: {
                id,
            },
            data: {
                validated_at: date,
                verification_token: null,
                verification_token_expires_at: null,
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
    async findByToken(token: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                verification_token: token,
            },
        });
    }
    async setVerificationToken(
        userId: string,
        token: string,
        expireAt: Date
    ): Promise<User> {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                verification_token: token,
                verification_token_expires_at: expireAt,
            },
        });
    }
    async changeRole(userId: string, role: ROLE): Promise<User> {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                role,
            },
        });
    }
}
