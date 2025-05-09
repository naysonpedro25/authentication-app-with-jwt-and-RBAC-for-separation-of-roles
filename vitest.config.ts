import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environmentMatchGlobs: [
            ['src/infra/http/controllers/*.test.ts', 'prisma'],
        ],
        testTimeout: 10000,
    },
});
