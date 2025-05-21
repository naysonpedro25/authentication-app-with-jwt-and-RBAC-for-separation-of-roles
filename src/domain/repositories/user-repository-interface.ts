import { Prisma, ROLE, User } from '@prisma/client';

export interface UserRepositoryInterface {
    create(user: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
    fetchMany(page: number): Promise<User[]>;
    delete(userId: string): Promise<User | null>;
    changePassword(userId: string, passwordHash: string): Promise<User>;
    clearVerificationToken(userId: string): Promise<User>;
    validate(id: string, date: Date): Promise<User>;
    deleteUnverified(): Promise<void>;
    findByToken(token: string): Promise<User | null>;
    fetchAllLength(): Promise<number>;
    setVerificationToken(
        userId: string,
        token: string,
        expireAt: Date
    ): Promise<User>;
    changeRole(userId: string, role: ROLE): Promise<User>;
}
