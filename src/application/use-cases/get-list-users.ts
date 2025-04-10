import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';

interface GetListUserUseCaseRequest {
    page: number;
}

interface GetListUserUseCaseResponse {
    users: Omit<User, 'password_hash' | 'validated_at'>[];
}

export class GetListUserUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        page,
    }: GetListUserUseCaseRequest): Promise<GetListUserUseCaseResponse> {
        const users = await this.userRepository.fetchMany(page);
        const mappedUsers = users.map(
            ({ password_hash, validated_at, ...rest }) => rest
        );

        return {
            users: mappedUsers,
        };
    }
}
