import { PrismaUserRepositoryImp } from '@/repository/prisma-user-repository-imp';
import { ValidateUserUseCase } from '../validate-user';

export function makeValidateUserUseCase() {
    const userRepository = new PrismaUserRepositoryImp();
    return new ValidateUserUseCase(userRepository);
}
