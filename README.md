# Requsitos Funcionais

- [x] deve ser possível registrar um usuário
- [x] deve ser possível authenticar um usuário existente
- [x] deve ser possível validar um usuário 
- [x] deve ser possível adquirir o perfil de um usuário
- [ ] deve ser possível recuperar a senha de um usuário
- [ ] deve ser possível atualizar a informação de nome de um usuário logado
- [x] deve ser possível atualizar a infromação de senha de um usuário logado
- [x] deve ser possível listar usuários
- [x] deve ser possível deletar um usuário

# Regras de Negócio

- [x] O usuário não deve se cadastrar com email duplicado
- [x] a validação deve ser feita por email no momento do cadastro
- [ ] Um usuário pode deletar apenas seu própio registro
- [ ] deve ser preciso a confirmação da senha ao deletar um usuário
- [ ] Outros usuários podem ser deletado por um administrador do sistema
- [ ] Deve ser preciso uma confirmação por email para mudar a senha de um usuário
- [ ] Administradores podem apenas deletar usuários e não modificá-los
- [ ] Um administrador pode adicionar novos usuários

# Requsitos não Funcionais

- [x] A senha de cada usuário precisa ser criptografada
- [x] Os dados serão persistidos em um banco de dados PostgreSQL
- [x] A listagem de usuários precisa estar paginadas em 15 itens usuários pagina
- [x] Os usuários devem ser identificados por um JWT

# é só para uma validação de email para registros de users. Me da uma dica de como que seria essa validação, pois eu não posso mandar o endpoint da api não é? teria que mandar # provavelmente uma rota do meu front, mas ele é um spa sem libs ou freamworks
 