import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { RegisterUseCase } from '../register';

export function makeRegisterUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new RegisterUseCase(userRepository);
}
