# Skate Connect - Autenticação Local (demo)

Este projeto contém páginas de login, cadastro e recuperação de senha implementadas no front-end para fins de demonstração.

Arquivos importantes
- `index.html` - página inicial. Agora mostra sessão ativa quando o usuário faz login.
- `login/login.html` - página de login (usa e-mail + senha).
- `login/register.html` - página de cadastro.
- `login/forgot.html` / `login/reset.html` - fluxo de recuperação de senha (simulado localmente).
- `js/utils.js` - funções utilitárias (hash, validação)
- `js/ui.js` - toasts para feedback do usuário
- `css/style.css` - estilos (contém estilos de toast)

Como testar rapidamente
1. Abra `login/register.html` no navegador e crie um usuário.
2. Faça login em `login/login.html` com o e-mail e senha cadastrados.
3. Verifique `index.html` para ver o usuário ativo.
4. Teste "Esqueci minha senha" que gera um código (simulado) e permite redefinir a senha.

Atenção
- Isso é uma implementação somente front-end para demonstração. Não use `localStorage` para armazenar senhas em produção.
- Para produção, implemente um backend seguro com hashing forte (bcrypt/argon2) e envio de emails para recuperação de senha.


*** End of README ***