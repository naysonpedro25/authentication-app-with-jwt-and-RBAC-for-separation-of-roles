import { EmailService } from '@/domain/services/email-service-interface';
import { env } from '@/env';
import { SentMessageInfo } from 'nodemailer';
import { Resend } from 'resend';

export class ResendEmailService implements EmailService {
    private readonly resend: Resend;
    private readonly appName = `Gerenciador de usuários <noreplay@${env.EMAIL_DOMAIN}>`;
    constructor() {
        this.resend = new Resend(env.RESEND_EMAIL_SERVICE_API_KEY);
    }

    async sendVerificationEmailForChangePassword(
        email: string,
        token: string
    ): Promise<void | SentMessageInfo> {
        const url = `${env.FRONTEND_URL}/register/forgot-password/change-password?token=${token}`;
        const html = `
                    <h1>E-mail de validação de conta </h1>
                    <a href="${url}">Click aqui para poder mudar sua senha.</a>
                `;

        const { data, error } = await this.resend.emails.send({
            from: this.appName,
            to: email,
            subject: 'Mude sua senha com segurança!',
            html,
        });
        if (error) throw error;
    }
    async sendVerificationEmailForValidate(
        email: string,
        token: string
    ): Promise<void | SentMessageInfo> {
        const url = `${env.FRONTEND_URL}/register/email-validated?token=${token}`;
        const html = `
            <h1>E-mail de validação de conta </h1>
            <a href="${url}">Click aqui para poder validar su conta.</a>
        `;
        const { data, error } = await this.resend.emails.send({
            from: this.appName,
            to: email,
            subject: 'Comfirme seu e-mail para ativar a conta!',
            html,
        });

        if (error) throw error;
    }
}
