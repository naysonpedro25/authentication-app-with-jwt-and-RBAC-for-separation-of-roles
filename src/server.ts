import { app } from './app';
import { makeRegisterUseCase } from './application/use-cases/factory/make-register-use-case';
import { env } from './env';

app.listen({
    host: '0.0.0.0',
    port: env.PORT,
}).then(async (addrs) => {
    console.log(addrs);
    // const registerUseCase = makeRegisterUseCase();
    // for (let i = 1; i <= 23; i++) {
    //     await registerUseCase.execute({
    //         name: 'test-namekk' + i,
    //         email: `email-testkk${i}@gmail.com`,
    //         password: 'test123456',
    //     });
    // }
});
