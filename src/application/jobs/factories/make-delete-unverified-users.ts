import { PrismaUserRepositoryImp } from '@/infra/repositories-imp/prisma-user-repository-imp';
import { deleteUnverifiedUsers } from '@/application/jobs/delete-unverified-users';

export function makeDeleteUnverifiedUsers() {
    const userRepository = new PrismaUserRepositoryImp();
    return deleteUnverifiedUsers(userRepository);
}
