import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { GetUserProfileUseCase } from '../get-user-profile';

export function makeGetUserProfileUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new GetUserProfileUseCase(userRepository);
}
