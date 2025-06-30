// import { createTransport, Transporter } from 'nodemailer';
// import { env } from '@/env/index';
// import { EmailService } from '@/domain/services/email-service-interface';

// export class NodeMailerEmailServiceImp implements EmailService {
//     private trasnporter: Transporter;
//     private readonly appName = `Gerenciador de usuários <noreplay@${env.EMAIL_DOMAIN}>`;
//     constructor() {
//         if (env.NODE_ENV === 'production') {
//             this.trasnporter = createTransport({
//                 secure: true,
//                 service: 'gmail',
//                 auth: { user: env.EMAIL_ADDRESS, pass: env.EMAIL_PASS },
//             });
//         } else {
//             this.trasnporter = createTransport({
//                 host: 'smtp.ethereal.email',
//                 port: 587,
//                 auth: {
//                     user: 'katelin.graham41@ethereal.email',
//                     pass: 'ss8tYh9mfS8986uxDR',
//                 },
//             });
//         }
//     }
//     async sendVerificationEmailForValidate(
//         email: string,
//         token: string
//     ): Promise<void> {
//         const url = `${env.FRONTEND_URL}/user-validation?token=${token}`;
//         const html = `
//             <h1>E-mail de validação de conta </h1>
//             <a href="${url}">Click aqui para verificar o seu e-mail e validar sua conta.</a>
//         `;
//         await this.trasnporter.sendMail({
//             from: `${this.appName} <${env?.EMAIL_ADDRESS}>`,
//             to: email,
//             subject: 'Confirme seu e-mail para ativar a conta!',
//             html,
//         });
//     }

//     async sendVerificationEmailForChangePassword(
//         email: string,
//         token: string
//     ): Promise<void> {
//         const url = `${env.FRONTEND_URL}/users/me/change-password?token=${token}}`;
//         const html = `
//             <h1>E-mail de validação de conta </h1>
//             <a href="${url}">Click aqui para poder mudar sua senha.</a>
//         `;
//         await this.trasnporter.sendMail({
//             from: this.appName,
//             to: email,
//             subject: 'Mude sua senha com segurança!',
//             html,
//         });
//     }
// }
