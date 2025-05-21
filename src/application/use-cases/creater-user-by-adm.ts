import { ROLE, User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';
import { UserAlreadyExistError } from './errors/user-already-exist-error';
import { hash } from 'bcryptjs';
import { EmailAlreadySentError } from '@/application/use-cases/errors/email-already-sent-error';

interface CreateUserByAdmUseCaseRequest {
    name: string;
    email: string;
    password: string;
    role?: ROLE;
}

interface CreateUserByAdmUseCaseResponse {
    user: User;
}

export class CreateUserByAdmUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        name,
        email,
        password,
        role = 'USER',
    }: CreateUserByAdmUseCaseRequest): Promise<CreateUserByAdmUseCaseResponse> {
        const userAlreadyExist = await this.userRepository.findByEmail(email);

        if (userAlreadyExist && userAlreadyExist.validated_at) {
            throw new UserAlreadyExistError();
        }

        if (userAlreadyExist) {
            throw new EmailAlreadySentError();
        }

        const password_hash = await hash(password, 6);

        const user = await this.userRepository.create({
            name,
            email,
            password_hash,
            role,
            validated_at: new Date(),
        });

        return {
            user,
        };
    }
}
