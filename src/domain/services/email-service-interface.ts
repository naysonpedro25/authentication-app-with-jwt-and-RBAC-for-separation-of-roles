export interface EmailService {
    sendVerificationEmailForValidate(
        email: string,
        token: string
    ): Promise<void>;
    sendVerificationEmailForChangePassword(
        email: string,
        token: string
    ): Promise<void>;
}
