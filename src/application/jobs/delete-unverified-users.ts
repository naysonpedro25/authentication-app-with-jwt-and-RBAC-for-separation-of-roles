import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { Params } from 'fastify-cron';

export function deleteUnverifiedUsers(
    userRepository: UserRepositoryInterface
): Params {
    return {
        cronTime: '*/5 * * * *',
        start: true,
        onTick: async () => {
            await userRepository.deleteUnverified();
            console.log(new Date());
        },
    };
}
