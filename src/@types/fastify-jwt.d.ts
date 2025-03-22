// fastify-jwt.d.ts => tirei da doc https://github.com/fastify/fastify-jwt
import '@fastify/jwt';

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        payload: {}; // payload type is used for signing and verifying ( se eu quiser fz um payload pessoal eu teria q colocar aq)
        user: {
            sub: string;
        }; // user type is return type of `request.user` object
    }
}
