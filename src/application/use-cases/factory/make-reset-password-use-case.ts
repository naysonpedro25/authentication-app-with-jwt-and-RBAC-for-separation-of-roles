import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { ResetPasswordUseCase } from '@/application/use-cases/reset-password';

export function makeResetPasswordUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new ResetPasswordUseCase(userRepository);
}
