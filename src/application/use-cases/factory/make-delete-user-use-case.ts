import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { DeleteUserUseCase } from '../delete-user';

export function makeDeleteUserUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new DeleteUserUseCase(userRepository);
}
