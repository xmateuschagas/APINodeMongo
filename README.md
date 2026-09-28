# API de Tarefas (Node.js + MongoDB)

API REST para cadastro de usuários e gerenciamento de tarefas pessoais. Cada usuário só enxerga e altera as próprias tarefas, e todas as rotas de tarefas exigem autenticação por JWT.

Desenvolvida por **Mateus Chagas** ([LinkedIn](https://www.linkedin.com/in/mateusbchagas) · [GitHub](https://github.com/xmateuschagas)).

---

## Problema e proposta de valor

O projeto mostra, em escala pequena, o que uma API de produção precisa ter: autenticação com access e refresh token, senha com hash, validação de entrada antes de chegar ao controller e isolamento de dados por dono do recurso.

---

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Runtime / framework | Node.js, Express 5 |
| Banco de dados | MongoDB (Atlas ou local) com Mongoose 8 |
| Autenticação | JSON Web Token (access 15 min + refresh 7 dias) |
| Segurança | bcryptjs (hash de senha), CORS |
| Validação | Zod |
| Configuração | dotenv |

---

## Arquitetura

```
src/
├── server.js          # Bootstrap: conexão Mongo, middlewares, rotas
├── routes/            # Definição de endpoints
├── middlewares/
│   ├── tokenValidator.js   # Verifica Bearer token e injeta req.user
│   └── dataValidator.js    # Valida req.body com schemas Zod
├── schemas/           # Schemas Zod (registro e login)
├── controllers/       # Regras de negócio (auth, usuários, tarefas)
└── models/            # Schemas Mongoose (Account, Task)
```

**Fluxo de uma requisição protegida**

```
Request ──► tokenValidator (JWT) ──► dataValidator (Zod) ──► controller ──► Mongoose ──► MongoDB
```

**Destaques**

- Senha com `select: false` no schema: nunca volta em consultas por padrão.
- Consultas de tarefa sempre filtradas por `owner`, impedindo acesso a dados de outro usuário.
- Mensagens de erro de login genéricas, sem revelar se o e-mail existe.

---

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/users` | Não | Cadastra usuário (nome, e-mail, senha) |
| GET | `/api/users` | Não | Lista usuários |
| PUT | `/api/users/:id` | Não | Atualiza usuário |
| DELETE | `/api/users/:id` | Não | Remove usuário |
| POST | `/api/auth/login` | Não | Retorna access e refresh token |
| POST | `/api/auth/refresh` | Não | Gera novo access token |
| GET | `/api/auth/me` | Sim | Dados do usuário autenticado |
| POST | `/api/todos` | Sim | Cria tarefa |
| GET | `/api/todos` | Sim | Lista tarefas do usuário |
| PUT | `/api/todos/:id` | Sim | Atualiza tarefa |
| DELETE | `/api/todos/:id` | Sim | Remove tarefa |

Rotas autenticadas usam o cabeçalho `Authorization: Bearer <accessToken>`.

---

## Como rodar

### Pré-requisitos

- Node.js 18 ou superior
- MongoDB local ou um cluster no MongoDB Atlas

### Passo a passo

```bash
git clone https://github.com/xmateuschagas/APINodeMongo.git
cd APINodeMongo
npm install
```

Crie um arquivo `.env` na raiz:

```env
DB_URI=mongodb+srv://<usuario>:<senha>@<cluster>/<banco>
JWT_SECRET=<uma-chave-longa-e-aleatoria>
```

Inicie o servidor:

```bash
node src/server.js
```

A API sobe em `http://localhost:3000`.

### Exemplo rápido

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Mateus","email":"mateus@email.com","password":"123456"}'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mateus@email.com","password":"123456"}'
```

---

## Próximos passos

- Proteger as rotas de usuário com autenticação e autorização por perfil
- Segredo separado para o refresh token
- Testes de integração com Jest + Supertest
- Dockerfile e docker-compose com MongoDB

---

## Autor

**Mateus Chagas**, Engenheiro de Software
[LinkedIn](https://www.linkedin.com/in/mateusbchagas) · [GitHub](https://github.com/xmateuschagas)
