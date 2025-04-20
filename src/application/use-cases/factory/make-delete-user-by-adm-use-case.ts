import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { DeleteUserByAdmUseCase } from '../delete-user-by-adm';

export function makeDeleteUserByAdmUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new DeleteUserByAdmUseCase(userRepository);
}
