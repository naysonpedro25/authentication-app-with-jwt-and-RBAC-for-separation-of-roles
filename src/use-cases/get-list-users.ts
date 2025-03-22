import { User } from '@prisma/client';
import { UserRepositoryInterface } from '../repository/interfaces/user-repository-interface';

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
