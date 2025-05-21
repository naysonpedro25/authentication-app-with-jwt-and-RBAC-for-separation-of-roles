import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { CreateUserByAdmUseCase } from '../creater-user-by-adm';

export function makeCreateUserByAdmUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new CreateUserByAdmUseCase(userRepository);
}
