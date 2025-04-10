import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { GetListUserUseCase } from '../get-list-users';

export function makeGetListUserUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new GetListUserUseCase(userRepository);
}
