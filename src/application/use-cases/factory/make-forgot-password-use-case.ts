import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { ForgotPasswordUseCase } from '@/application/use-cases/forgot-password';
import { NodeMailerEmailServiceImp } from '@/infra/services/node-mailer-email-service-imp';

export function makeForgotPasswordUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    const emailService = new NodeMailerEmailServiceImp();
    return new ForgotPasswordUseCase(userRepository, emailService);
}
