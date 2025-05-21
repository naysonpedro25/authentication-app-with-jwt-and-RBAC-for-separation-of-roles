import { User } from '@prisma/client';
import { UserRepositoryInterface } from '@/domain/repositories/user-repository-interface';

import { UserAlreadyValidatedError } from './errors/user-already-velidated-error';
import { VerificationTokenInvalidError } from '@/application/use-cases/errors/verification-token-invalid-error';

interface ValidateUserUseCaseRequest {
    token: string;
}

interface ValidateUserUseCaseResponse {
    user: User;
}

export class ValidateUserUseCase {
    constructor(private userRepository: UserRepositoryInterface) {}
    async execute({
        token,
    }: ValidateUserUseCaseRequest): Promise<ValidateUserUseCaseResponse> {
        const userNotValidated = await this.userRepository.findByToken(token);

        if (!userNotValidated) {
            throw new VerificationTokenInvalidError();
        }
        if (userNotValidated.validated_at) {
            throw new UserAlreadyValidatedError();
        }
        if (
            !userNotValidated.verification_token_expires_at ||
            userNotValidated.verification_token_expires_at.getTime() <
                Date.now()
        ) {
            throw new VerificationTokenInvalidError();
        }
        await this.userRepository.validate(userNotValidated.id, new Date());
        const user = await this.userRepository.clearVerificationToken(
            userNotValidated.id
        );
        return {
            user,
        };
    }
}
