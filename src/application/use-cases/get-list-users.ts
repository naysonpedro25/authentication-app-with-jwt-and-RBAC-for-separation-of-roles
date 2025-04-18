import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';

interface GetListUserUseCaseRequest {
    page: number;
}

interface GetListUserUseCaseResponse {
    users: User[];
}

export class GetListUserUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        page,
    }: GetListUserUseCaseRequest): Promise<GetListUserUseCaseResponse> {
        const users = await this.userRepository.fetchMany(page);

        return {
            users,
        };
    }
}
