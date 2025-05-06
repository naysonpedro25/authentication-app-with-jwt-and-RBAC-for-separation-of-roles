import { FastifyJWT } from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
    try {
        if (!request.headers.authorization) {
            return reply.status(401).send({
                message: 'Unauthorized',
            });
        }
        const token = await request.jwtVerify({ onlyCookie: false });
    } catch (error) {
        return reply.status(401).send({
            message: 'Unauthorized',
        });
    }
}
