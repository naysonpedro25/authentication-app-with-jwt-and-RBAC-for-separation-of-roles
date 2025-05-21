import { EmailService } from '@/domain/services/email-service-interface';
import { env } from '@/env';
import { SentMessageInfo } from 'nodemailer';
import { Resend } from 'resend';

export class ResendEmailService implements EmailService {
    private readonly resend: Resend;
    private readonly appName = `Gerenciador de Usuários <noreply@${env.EMAIL_DOMAIN}>`;

    constructor() {
        this.resend = new Resend(env.RESEND_EMAIL_SERVICE_API_KEY);
    }

    async sendVerificationEmailForChangePassword(
        email: string,
        token: string
    ): Promise<void | SentMessageInfo> {
        const url = new URL(env.EMAIL_RESET_PASSWORD_URL);
        url.searchParams.set('token', token);
        const html = `
            <h1>Redefinição de senha</h1>
            <p>Você solicitou a redefinição de sua senha. Para continuar, clique no link abaixo:</p>
            <a href="${url.toString()}" target="_blank" rel="noopener noreferrer">Clique aqui para redefinir sua senha</a>
            <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
        `;

        const { error } = await this.resend.emails.send({
            from: this.appName,
            to: email,
            subject: 'Redefina sua senha com segurança',
            html,
        });

        if (error) throw error;
    }

    async sendVerificationEmailForValidate(
        email: string,
        token: string
    ): Promise<void | SentMessageInfo> {
        const url = new URL(env.EMAIL_VALIDATION_URL);
        url.searchParams.set('token', token);

        const html = `
            <h1>Validação de conta</h1>
            <p>Obrigado por se cadastrar! Para ativar sua conta, clique no link abaixo:</p>
            <a href="${url.toString()}" target="_blank" rel="noopener noreferrer">Clique aqui para validar seu e-mail</a>
            <p>Se você não se cadastrou, ignore este e-mail.</p>
        `;

        const { error } = await this.resend.emails.send({
            from: this.appName,
            to: email,
            subject: 'Confirme seu e-mail para ativar sua conta',
            html,
        });

        if (error) throw error;
    }
}
