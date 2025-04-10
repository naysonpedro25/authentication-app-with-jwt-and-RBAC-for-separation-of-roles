import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { VerifyUserByEmailUseCase } from '../verify-user-by-email';
import { NodeMailerEmailServiceImp } from '@/infra/services/node-mailer-email-service-imp';

export function makeVerifyUserByEmailUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    const emailService = new NodeMailerEmailServiceImp();
    return new VerifyUserByEmailUseCase(userRepository, emailService);
}
