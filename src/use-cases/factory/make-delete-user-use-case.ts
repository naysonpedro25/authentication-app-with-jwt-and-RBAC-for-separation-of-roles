import { PrismaUserRepositoryImp } from '@/repository/prisma-user-repository-imp';
import { DeleteUserUseCase } from '../delete-user';

export function makeDeleteUserUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new DeleteUserUseCase(userRepository);
}
