import type { Environment } from 'vitest/environments';
import { randomUUID } from 'node:crypto';
import * as process from 'node:process';
import { execSync } from 'node:child_process';
import { prisma } from '@/infra/lib/prisma';
import { env } from '@/env';
function generateDBURL(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error();
    }

    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schema);

    return url.toString();
}
export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        // executa antes de cada arquivo/suit de test
        const schema = randomUUID();
        const newUrlDb = generateDBURL(schema);
        process.env.DATABASE_URL = newUrlDb;

        execSync('npx prisma migrate deploy');
        return {
            async teardown() {
                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${schema} CASCADE"`
                );
                await prisma.$disconnect();
            }, // executa depois de cada arquivo/suit de test
        };
    },
};
