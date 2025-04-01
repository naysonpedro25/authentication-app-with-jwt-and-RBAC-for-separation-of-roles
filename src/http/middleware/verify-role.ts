import { ROLE } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyRole(userRole: ROLE) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = request.user;
        if (role === userRole) {
            return reply.status(401).send({
                message: 'Unauthorized',
            });
        }
    };
}
