import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { ForgotPasswordUseCase } from '@/application/use-cases/forgot-password';
import { ResendEmailService } from '@/infra/services/resend-email-service-imp';

export function makeForgotPasswordUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    const emailService = new ResendEmailService();
    return new ForgotPasswordUseCase(userRepository, emailService);
}
