import { createTransport } from 'nodemailer';
import { env } from '@/env/index';

export async function sendVerificationEmail(email: string, token: string) {
    let trasnporter;

    if (env.NODE_ENV === 'production') {
        trasnporter = createTransport({
            secure: true,
            service: 'gmail',
            auth: { user: env.EMAIL_ADDRESS, pass: env.EMAIL_PASS },
        });
    } else {
        trasnporter = createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'katelin.graham41@ethereal.email',
                pass: 'ss8tYh9mfS8986uxDR',
            },
        });
    }
    const link = `http://localhost:3333/session/verify-email?token=${token}&email=${email}`;
    await trasnporter.sendMail({
        from: 'Gerenciador de user kk',
        to: email,
        subject: 'Verifique seu email',
        html: `<p>
            <a href=${link} >Click no aqui</a> para verificar seu endereço de e-mail        
        </p>`,
    });
}
