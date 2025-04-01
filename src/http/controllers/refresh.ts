import { FastifyReply, FastifyRequest } from 'fastify';
import { InvalidCredentials } from '@/use-cases/errors/invalid-credentials-error';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify({ onlyCookie: true }); // vai verificar apenas o jwt do cookie, ou seja o refresh token
        // se for valido (ou seja não passou 7d com o user inativo)
        const token = await reply.jwtSign(
            // é criado um novo token
            {
                role: request.user.role,
            },
            {
                sign: {
                    sub: request.user.sub, // esse sub é da validação do refresh token anterior
                },
            }
        );
        const refreshToken = await reply.jwtSign(
            // é criado tb um novo refresh token
            {
                role: request.user.role,
            },
            {
                sign: {
                    sub: request.user.sub,
                    expiresIn: '7d',
                },
            }
        );

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/', // quais rotas da aplicação tem acesso ao cookie (todas com o /)
                secure: true, // se o cookie vai ser encriptado com o https (se o front estiver usando https, se for local fudeu), impossibilitando o front de pegar o cookie direto como string
                sameSite: true, // cookie só pode ser acessado dentro do mesmo domínio
                httpOnly: true, // cookie só pode ser acessado pelo back, sem ser armazenado pelo front nos cookies no browser.
            })
            .status(200)
            .send({
                token,
            });
    } catch (error) {
        throw error;
    }
}
