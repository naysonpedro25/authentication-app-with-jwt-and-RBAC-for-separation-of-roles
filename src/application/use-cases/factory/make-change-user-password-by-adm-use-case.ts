import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { ChangeUserPasswordByAdmUseCase } from '../change-user-password-by-adm';

export function makeChangeUserPasswordByAdmUsecCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new ChangeUserPasswordByAdmUseCase(userRepository);
}
