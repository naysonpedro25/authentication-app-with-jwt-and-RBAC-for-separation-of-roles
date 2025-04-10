import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { VerifyUserForgotPasswordUseCase } from '@/application/use-cases/verify-user-forgot-password';
import { NodeMailerEmailServiceImp } from '@/infra/services/node-mailer-email-service-imp';

export function makeVerifyUserForgotPasswordUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    const emailService = new NodeMailerEmailServiceImp();
    return new VerifyUserForgotPasswordUseCase(userRepository, emailService);
}
