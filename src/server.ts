import { app } from './app';
import { makeCreateUserByAdmUseCase } from './application/use-cases/factory/make-create-user-by-adm-use-case';
import { env } from './env';

app.listen({
    host: '0.0.0.0',
    port: env.PORT,
}).then(async (addrs) => {
    console.log(addrs);
    // const registerUseCase = makeCreateUserByAdmUseCase();
    // for (let i = 1; i <= 23; i++) {
    //     await registerUseCase.execute({
    //         name: 'test0102030304' + i,
    //         email: `emailfff-testkk${i}@gmail.com`,
    //         password: 'test123456',
    //     });
    // }
});
