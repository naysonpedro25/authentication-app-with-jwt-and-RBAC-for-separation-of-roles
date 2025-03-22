import { PrismaUserRepositoryImp } from '@/repository/prisma-user-repository-imp';
import { VerifyUserByEmailUseCase } from '../verify-user-by-email';

export function makeVerifyUserByEmailUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new VerifyUserByEmailUseCase(userRepository);
}
