import { PrismaUserRepositoryImp } from '@/repository/prisma-user-repository-imp';
import { GetListUserUseCase } from '../get-list-users';

export function makeGetListUserUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new GetListUserUseCase(userRepository);
}
