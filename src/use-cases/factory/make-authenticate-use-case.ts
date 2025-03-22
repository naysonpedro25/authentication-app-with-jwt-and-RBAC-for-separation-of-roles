import { PrismaUserRepositoryImp } from '@/repository/prisma-user-repository-imp';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new AuthenticateUseCase(userRepository);
}
