import { SentMessageInfo } from 'nodemailer';
export interface EmailService {
    sendVerificationEmailForValidate(
        email: string,
        token: string
    ): Promise<void | SentMessageInfo>;
    sendVerificationEmailForChangePassword(
        email: string,
        token: string
    ): Promise<void | SentMessageInfo>;
}
