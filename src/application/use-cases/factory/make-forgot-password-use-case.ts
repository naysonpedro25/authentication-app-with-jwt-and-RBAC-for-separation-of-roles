import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { ForgotUserPasswordUseCase } from '@/application/use-cases/forgot-user-password';

export function makeForgotPasswordUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new ForgotUserPasswordUseCase(userRepository);
}
