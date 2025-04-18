# Requsitos Funcionais

- [x] deve ser possível registrar um usuário
- [x] deve ser possível authenticar um usuário existente
- [x] deve ser possível validar um usuário 
- [x] deve ser possível adquirir o perfil de um usuário
- [x] deve ser possível atualizar a infromação de senha de um usuário 
- [x] deve ser possível listar usuários
- [x] deve ser possível deletar um usuário

# Regras de Negócio

- [x] O usuário não deve se cadastrar com email duplicado
- [x] a validação deve ser feita por email no momento do cadastro
- [x] Um usuário pode deletar apenas seu própio registro
- [x] deve ser preciso a confirmação da senha ao deletar um usuário
- [x] Outros usuários podem ser deletado por um administrador do sistema
- [x] Um usuário logado deve fornecer a senha atual para mudar para uma nova
- [x] Deve ser preciso uma confirmação por email para mudar a senha de um usuário caso ele esqueça
- [x] Administradores podem apenas deletar usuários e não modificá-los
- [x] Um administrador pode adicionar novos usuários
- [x] Se um usuário não for validado ele deve ser excluido do banco de dados (cron-job)
# Requsitos não Funcionais

- [x] A senha de cada usuário precisa ser criptografada
- [x] Os dados serão persistidos em um banco de dados PostgreSQL
- [x] A listagem de usuários precisa estar paginadas em 15 itens usuários pagina
- [x] Os usuários devem ser identificados por um JWT
