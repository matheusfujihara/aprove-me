<p align="center">
  <img src="./assets/logo-bankme.png" alt="Logo Bankme" width="91" height="108">
</p>
<h1 align="center">Aprove-me</h1>

Sistema de gestão de recebíveis com API NestJS, frontend Next.js, RabbitMQ e Mailpit.

---

## Sumário

- [Inicializando com Docker](#inicializando-com-docker)
- [UIs de infraestrutura](#uis-de-infraestrutura)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
  - [Usuários](#usuários)
  - [Cedentes](#cedentes-assignors)
  - [Recebíveis](#recebíveis-payables)
- [Resumo dos endpoints](#resumo-dos-endpoints)

---

## Inicializando com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados

### Subir todos os serviços

```bash
docker compose up --build
```

Todos os serviços sobem automaticamente:

| Serviço  | Endereço local         |
| -------- | ---------------------- |
| API      | http://localhost:3001  |
| Frontend | http://localhost:3000  |
| RabbitMQ | http://localhost:15672 |
| Mailpit  | http://localhost:8025  |

### Parar todos os serviços

```bash
docker compose down
```

### Reiniciar serviços

```bash
docker compose restart
```

---

## UIs de infraestrutura

### Frontend (Next.js)

- URL: http://localhost:3000
- Interface completa para gerenciar cedentes e recebíveis

### RabbitMQ Management

- URL: http://localhost:15672
- Usuário: `bankme`
- Senha: `bankme123`
- Usado para monitorar filas de processamento em lote

### Mailpit (caixa de entrada de e-mails de desenvolvimento)

- URL: http://localhost:8025
- Sem autenticação
- Captura todos os e-mails enviados pela API (notificações de lote processado, falhas na dead letter queue, etc.)

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto para sobrescrever os valores padrão:

```env
PORT=3001
RABBITMQ_USER=bankme
RABBITMQ_PASS=bankme123
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USER=
MAIL_PASS=
MAIL_FROM=noreply@bankme.com
```

---

## Módulos

### `auth`

Responsável por toda a lógica de autenticação:

- `POST /auth/login` — autentica o usuário e retorna um JWT
- `JwtAuthGuard` — guard global que protege todas as rotas (exceto as marcadas com `@Public()`)
- `LoginUseCase` — valida credenciais e assina o token

### `users`

Gerencia o cadastro de usuários:

- `POST /users` — cria um novo usuário (`@Public()`)
- `GET /users/me` — retorna os dados do usuário autenticado (extraídos do JWT)

### `assignors`

CRUD de cedentes (entidades vinculadas aos recebíveis).

### `payables`

CRUD de recebíveis, incluindo processamento assíncrono via RabbitMQ para lotes.

## Arquitetura

O projeto segue os princípios de **Clean Architecture** com separação em camadas:

- `domain/` — entidades e interfaces de repositório
- `application/` — casos de uso e DTOs
- `infrastructure/` — controllers, persistência Prisma e guards

## Endpoints da API

**Base URL:** `http://localhost:3001/integrations`

A maioria dos endpoints exige autenticação via **JWT Bearer Token**.  
Para obter o token, faça login em `POST /integrations/auth/login` e use o valor retornado como `Authorization: Bearer <token>` nos demais endpoints.

---

### Usuários

#### Registrar usuário

```
POST /integrations/users
```

Não requer autenticação.

**Body:**

```json
{
  "email": "usuario@email.com",
  "password": "Senha@Forte1"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/integrations/users \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"Senha@Forte1"}'
```

---

#### Login

```
POST /integrations/auth/login
```

Não requer autenticação.

**Body:**

```json
{
  "email": "usuario@email.com",
  "password": "Senha@Forte1"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/integrations/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"Senha@Forte1"}'
```

> O token JWT retornado deve ser usado como `Bearer <token>` em todos os demais endpoints.

---

#### Obter usuário autenticado

```
GET /integrations/users/me
```

Requer autenticação.

**curl:**

```bash
curl http://localhost:3001/integrations/users/me \
  -H "Authorization: Bearer <token>"
```

---

### Cedentes (Assignors)

#### Listar todos os cedentes

```
GET /integrations/assignor
```

**curl:**

```bash
curl http://localhost:3001/integrations/assignor \
  -H "Authorization: Bearer <token>"
```

---

#### Criar cedente

```
POST /integrations/assignor
```

**Body:**

```json
{
  "document": "12345678901",
  "email": "cedente@email.com",
  "phone": "11999999999",
  "name": "João da Silva"
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/integrations/assignor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"document":"12345678901","email":"cedente@email.com","phone":"11999999999","name":"João da Silva"}'
```

---

#### Buscar cedente por ID

```
GET /integrations/assignor/:id
```

**curl:**

```bash
curl http://localhost:3001/integrations/assignor/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

---

#### Atualizar cedente

```
PATCH /integrations/assignor/:id
```

**Body (todos os campos são opcionais):**

```json
{
  "name": "João Atualizado",
  "email": "novo@email.com",
  "phone": "11888888888",
  "document": "98765432100"
}
```

**curl:**

```bash
curl -X PATCH http://localhost:3001/integrations/assignor/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"João Atualizado"}'
```

---

#### Deletar cedente

```
DELETE /integrations/assignor/:id
```

**curl:**

```bash
curl -X DELETE http://localhost:3001/integrations/assignor/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

---

### Recebíveis (Payables)

#### Listar todos os recebíveis

```
GET /integrations/payable
```

**curl:**

```bash
curl http://localhost:3001/integrations/payable \
  -H "Authorization: Bearer <token>"
```

---

#### Criar recebível

```
POST /integrations/payable
```

**Body:**

```json
{
  "payable": {
    "value": 1500.0,
    "emissionDate": "2026-04-07T00:00:00.000Z"
  },
  "assignor": {
    "document": "12345678901",
    "email": "cedente@email.com",
    "phone": "11999999999",
    "name": "João da Silva"
  }
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/integrations/payable \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"payable":{"value":1500.00,"emissionDate":"2026-04-07T00:00:00.000Z"},"assignor":{"document":"12345678901","email":"cedente@email.com","phone":"11999999999","name":"João da Silva"}}'
```

---

#### Buscar recebível por ID

```
GET /integrations/payable/:id
```

**curl:**

```bash
curl http://localhost:3001/integrations/payable/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

---

#### Atualizar recebível

```
PATCH /integrations/payable/:id
```

**Body (todos os campos são opcionais):**

```json
{
  "value": 2000.0,
  "emissionDate": "2026-04-07T00:00:00.000Z",
  "assignorId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**curl:**

```bash
curl -X PATCH http://localhost:3001/integrations/payable/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"value":2000.00}'
```

---

#### Deletar recebível

```
DELETE /integrations/payable/:id
```

**curl:**

```bash
curl -X DELETE http://localhost:3001/integrations/payable/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

---

#### Criar recebíveis em lote (batch)

```
POST /integrations/payable/batch
```

Processamento assíncrono via RabbitMQ. Suporta de 1 a 10.000 itens por requisição.  
Ao final do processamento, um e-mail é enviado com o número de sucessos e falhas.  
Itens com falha são reprocessados até 4 vezes; após isso vão para a dead letter queue e um novo e-mail é disparado para o time de operações.

**Body:**

```json
{
  "payables": [
    {
      "payable": {
        "value": 1500.0,
        "emissionDate": "2026-04-07T00:00:00.000Z"
      },
      "assignor": {
        "document": "12345678901",
        "email": "cedente@email.com",
        "phone": "11999999999",
        "name": "João da Silva"
      }
    },
    {
      "payable": {
        "value": 750.5,
        "emissionDate": "2026-04-07T00:00:00.000Z"
      },
      "assignor": {
        "document": "98765432100",
        "email": "outro@email.com",
        "phone": "11888888888",
        "name": "Maria Souza"
      }
    }
  ]
}
```

**curl:**

```bash
curl -X POST http://localhost:3001/integrations/payable/batch \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"payables":[{"payable":{"value":1500.00,"emissionDate":"2026-04-07T00:00:00.000Z"},"assignor":{"document":"12345678901","email":"cedente@email.com","phone":"11999999999","name":"João da Silva"}},{"payable":{"value":750.50,"emissionDate":"2026-04-07T00:00:00.000Z"},"assignor":{"document":"98765432100","email":"outro@email.com","phone":"11888888888","name":"Maria Souza"}}]}'
```

---

## Resumo dos endpoints

| Método | Endpoint                      | Auth | Descrição                 |
| ------ | ----------------------------- | ---- | ------------------------- |
| POST   | `/integrations/users`         | ❌   | Registrar usuário         |
| POST   | `/integrations/auth/login`    | ❌   | Login (obtém JWT)         |
| GET    | `/integrations/users/me`      | ✅   | Usuário autenticado atual |
| GET    | `/integrations/assignor`      | ✅   | Listar cedentes           |
| POST   | `/integrations/assignor`      | ✅   | Criar cedente             |
| GET    | `/integrations/assignor/:id`  | ✅   | Buscar cedente por ID     |
| PATCH  | `/integrations/assignor/:id`  | ✅   | Atualizar cedente         |
| DELETE | `/integrations/assignor/:id`  | ✅   | Deletar cedente           |
| GET    | `/integrations/payable`       | ✅   | Listar recebíveis         |
| POST   | `/integrations/payable`       | ✅   | Criar recebível           |
| GET    | `/integrations/payable/:id`   | ✅   | Buscar recebível por ID   |
| PATCH  | `/integrations/payable/:id`   | ✅   | Atualizar recebível       |
| DELETE | `/integrations/payable/:id`   | ✅   | Deletar recebível         |
| POST   | `/integrations/payable/batch` | ✅   | Criar recebíveis em lote  |
