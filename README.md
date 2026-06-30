# IronPro - Sistema de Gerenciamento de Academia

Plataforma full-stack para gestão de treinos, alunos e professores em uma academia. Permite que professores criem treinos e os atribuam a alunos, e que alunos solicitem consultorias com professores.

## 🔗 Repositório
> `https://github.com/Caua-Azevedo/Sistema-gerenciamento-academia-v2`

## 👥 Integrantes do Grupo

- Roberto Cauã
- Samuel
- Louhan Tinnis

## 📋 Descrição da Aplicação

O **IronPro** é um sistema de gerenciamento de academia com dois perfis de usuário:

- **Professor**: cria e gerencia treinos, atribui treinos a alunos e responde a solicitações de consultoria.
- **Aluno**: visualiza os treinos atribuídos a ele e solicita consultorias com os professores.

A aplicação é dividida em:
- **Frontend (`/client`)**: SPA em React responsável pela interface.
- **Backend (`/server`)**: API REST em Node.js/Express responsável pelas regras de negócio, autenticação e persistência dos dados no MongoDB.

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- wouter (roteamento)
- axios (consumo da API)
- shadcn/ui + Radix UI (componentes)
- sonner (notificações/toasts)

### Backend
- Node.js + Express
- TypeScript (`tsx` em desenvolvimento, `esbuild` no build de produção)
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senhas
- `cors`, `dotenv`

## 📁 Estrutura do Projeto

```
Sistema-gerenciamento-academia-main/
├── client/                     # Frontend (React + Vite)
│   ├── index.html
│   └── src/
│       ├── components/         # Componentes de UI (shadcn/ui, layout, etc.)
│       ├── contexts/
│       │   ├── AuthContext.tsx     # Autenticação (consome /api/auth)
│       │   ├── DataContext.tsx     # Treinos e consultorias (consome /api/workouts e /api/consultations)
│       │   └── ThemeContext.tsx
│       ├── lib/
│       │   └── api.ts           # Instância do axios + interceptor de token JWT
│       ├── pages/               # Páginas (Login, Register, Dashboard, Workouts, etc.)
│       └── ...
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── index.ts                 # Ponto de entrada: conecta no Mongo, registra rotas, serve o build em produção
│   ├── config/
│   │   └── db.ts                # Conexão com o MongoDB via Mongoose
│   ├── models/
│   │   ├── User.ts              # Usuários (alunos, professores, admin)
│   │   ├── Workout.ts           # Treinos e exercícios
│   │   └── Consultation.ts      # Solicitações de consultoria
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── workout.controller.ts
│   │   └── consultation.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── workout.routes.ts
│   │   └── consultation.routes.ts
│   ├── middleware/
│   │   └── auth.ts              # Middlewares requireAuth (JWT) e requireRole (autorização)
│   └── utils/
│       ├── jwt.ts               # Assinatura/verificação de tokens
│       └── seed.ts              # Popula dados de demonstração na primeira execução
│
├── shared/                      # Código compartilhado entre client/server
├── .env.example                 # Exemplo de variáveis de ambiente do backend
├── vite.config.ts               # Configuração do Vite (inclui proxy de /api para o backend em dev)
└── package.json
```

## 🔌 Endpoints da API

Todas as rotas (exceto registro/login) exigem o header `Authorization: Bearer <token>`.

### Autenticação (`/api/auth`)

| Método | Rota             | Acesso         | Descrição                                  |
|--------|-------------------|----------------|---------------------------------------------|
| POST   | `/api/auth/register` | Público     | Cria uma nova conta (aluno ou professor)    |
| POST   | `/api/auth/login`    | Público     | Autentica e retorna `{ user, token }`       |
| GET    | `/api/auth/me`       | Autenticado | Retorna os dados do usuário logado          |

### Treinos (`/api/workouts`)

| Método | Rota                          | Acesso              | Descrição                                       |
|--------|-------------------------------|---------------------|--------------------------------------------------|
| GET    | `/api/workouts`               | Autenticado         | Lista todos os treinos                          |
| GET    | `/api/workouts/:id`           | Autenticado         | Detalha um treino específico                    |
| POST   | `/api/workouts`                | Apenas **professor** | Cria um novo treino (com lista de exercícios)  |
| PUT    | `/api/workouts/:id`            | Apenas o **professor dono** | Atualiza nome, descrição e/ou exercícios |
| DELETE | `/api/workouts/:id`            | Apenas o **professor dono** | Remove o treino                          |
| PATCH  | `/api/workouts/:id/assign`     | Apenas o **professor dono** | Atribui o treino a um aluno (`studentId`) |

### Consultorias (`/api/consultations`)

| Método | Rota                       | Acesso              | Descrição                                          |
|--------|----------------------------|----------------------|------------------------------------------------------|
| GET    | `/api/consultations`       | Autenticado          | Lista todas as solicitações de consultoria          |
| GET    | `/api/consultations/:id`   | Autenticado          | Detalha uma solicitação                             |
| POST   | `/api/consultations`        | Apenas **aluno**     | Cria uma solicitação de consultoria                 |
| PATCH  | `/api/consultations/:id`    | Apenas **professor** | Aceita ou recusa a solicitação (`status`)           |
| DELETE | `/api/consultations/:id`    | Apenas **professor**| Remove uma solicitação                              |

## 🗄️ Modelagem do Banco de Dados

### `User`
| Campo     | Tipo                              | Observações                          |
|-----------|------------------------------------|---------------------------------------|
| name      | String                              | obrigatório                           |
| email     | String                              | obrigatório, único, formato validado  |
| password  | String (hash bcrypt)                | obrigatório, mín. 6 caracteres        |
| type      | `student` \| `teacher` \| `admin`  | papel do usuário (autorização)        |
| avatar    | String                              | opcional                              |

### `Workout` (referencia `User` via `teacherId`)
| Campo            | Tipo                  | Observações                                |
|------------------|-----------------------|----------------------------------------------|
| name             | String                | obrigatório                                  |
| description      | String                | obrigatório                                  |
| teacherId        | String                | id do professor que criou o treino           |
| teacherName      | String                | nome do professor (cache para exibição)      |
| exercises        | Array de `Exercise`   | pelo menos 1 exercício obrigatório           |
| assignedStudents | Array de String       | ids dos alunos com o treino atribuído        |

`Exercise` (subdocumento): `id`, `name`, `series`, `reps`, `weight?`, `notes?`.

### `Consultation` (referencia `User` via `studentId` / `teacherId`)
| Campo       | Tipo                                      | Observações                       |
|-------------|---------------------------------------------|-------------------------------------|
| studentId   | String                                      | id do aluno solicitante             |
| studentName | String                                      | nome do aluno (cache)               |
| teacherId   | String                                      | preenchido quando um professor responde |
| status      | `pending` \| `accepted` \| `rejected`       | padrão: `pending`                   |
| message     | String                                      | obrigatório, máx. 500 caracteres    |

**Relacionamentos:** `Workout.teacherId` → `User._id` (1 professor : N treinos) · `Workout.assignedStudents` → `User._id` (N : N treinos/alunos) · `Consultation.studentId` / `Consultation.teacherId` → `User._id`.

## 🔐 Autenticação e Autorização

- Login/registro retornam um **JWT** assinado pelo backend (`jsonwebtoken`), armazenado no `localStorage` do navegador.
- Toda requisição autenticada envia o token no header `Authorization: Bearer <token>` (configurado automaticamente no `client/src/lib/api.ts`).
- O middleware `requireAuth` valida o token em todas as rotas protegidas.
- O middleware `requireRole('teacher' | 'student')` garante o **controle de acesso por perfil**: por exemplo, apenas professores podem criar/editar/deletar treinos e responder consultorias; apenas alunos podem solicitar consultoria.
- Senhas nunca são salvas em texto puro — são hasheadas com `bcryptjs` antes de ir para o banco.

## ✅ Validações Implementadas

- Campos obrigatórios em todos os formulários (nome, email, senha, treino, exercícios, mensagem de consultoria).
- Formato de email validado por regex.
- Senha com mínimo de 6 caracteres.
- Email único (não permite cadastro duplicado).
- Treino precisa ter ao menos 1 exercício; cada exercício precisa de nome, séries e repetições.
- Mensagem de consultoria entre 1 e 500 caracteres.
- Status de consultoria restrito a `accepted` ou `rejected` no momento da resposta.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- MongoDB rodando localmente (`mongodb://127.0.0.1:27017`) **ou** uma string de conexão do MongoDB Atlas

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure as variáveis de ambiente
Copie o arquivo de exemplo e ajuste se necessário:
```bash
cp .env.example .env
```
```env
MONGODB_URI=mongodb://127.0.0.1:27017/ironpro
JWT_SECRET=troque_este_valor_em_producao
JWT_EXPIRES_IN=7d
PORT=5000
```

### 3. Rode o frontend + backend juntos (modo desenvolvimento)
```bash
npm run dev
```
Isso inicia **simultaneamente**:
- o **frontend** (Vite) em `http://localhost:3000`
- o **backend** (Express + MongoDB) em `http://localhost:5000`

O Vite já está configurado para encaminhar (`proxy`) todas as chamadas `/api/*` feitas pelo frontend para o backend, então basta abrir `http://localhost:3000` no navegador.

> Quer rodar cada parte separadamente? Use `npm run dev:client` (apenas frontend) e `npm run dev:server` (apenas backend) em terminais distintos.

### 4. Dados de demonstração
Na primeira execução, o backend popula automaticamente o banco com os mesmos dados de demonstração já anunciados na tela de login:

- **Aluno:** `aluno@ironpro.com` / `123456`
- **Professor:** `professor@ironpro.com` / `123456`

Caso queira repopular manualmente (banco vazio), rode:
```bash
npm run seed
```

### 5. Build de produção
```bash
npm run build
npm start
```
O comando `start` levanta um único servidor Express (porta definida em `PORT`, padrão `5000`) que serve a API **e** os arquivos estáticos do frontend já compilado.

## 🔄 Integração Frontend ↔ Backend

- O frontend usa uma instância do **axios** (`client/src/lib/api.ts`) com `baseURL: "/api"` e um interceptor que injeta automaticamente o token JWT salvo no `localStorage`.
- `AuthContext` chama `/api/auth/register`, `/api/auth/login` e `/api/auth/me` para autenticação real (substituindo o mock anterior).
- `DataContext` busca os treinos e consultorias reais via `/api/workouts` e `/api/consultations` ao autenticar, e todas as ações (criar, editar, deletar, atribuir treino, aceitar/recusar consultoria) chamam a API real, com atualização otimista da interface.
- **Nenhum componente visual ou página foi alterado** — toda a integração foi feita apenas na camada de dados (`contexts/`), preservando 100% do layout e comportamento original da Fase 1.
