import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new AuthenticateUseCase(userRepository);
}
