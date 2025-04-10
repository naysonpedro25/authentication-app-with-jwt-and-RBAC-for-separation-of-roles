import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { ChangeUserPasswordUseCase } from '../change-user-password';

export function makeChangeUserPasswordUsecCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new ChangeUserPasswordUseCase(userRepository);
}
