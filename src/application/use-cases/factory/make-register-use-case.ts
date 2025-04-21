import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { RegisterUseCase } from '../register';
import { ResendEmailService } from '@/infra/services/resend-email-service-imp';

export function makeRegisterUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    const emailService = new ResendEmailService();
    return new RegisterUseCase(userRepository, emailService);
}
