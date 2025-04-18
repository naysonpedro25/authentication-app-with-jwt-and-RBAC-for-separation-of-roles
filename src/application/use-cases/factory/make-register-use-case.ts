import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { RegisterUseCase } from '../register';
import { NodeMailerEmailServiceImp } from '@/infra/services/node-mailer-email-service-imp';

export function makeRegisterUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    const emailService = new NodeMailerEmailServiceImp();
    return new RegisterUseCase(userRepository, emailService);
}
