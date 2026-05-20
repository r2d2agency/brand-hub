# Plataforma

Monorepo com backend (Express + Prisma + Postgres) e frontend (Vite + React + Tailwind).
Pensado para self-host no **Easypanel**.

## Estrutura

```
backend/   # API REST, Prisma, JWT
frontend/  # SPA Vite + React + React Router
docker-compose.yml  # roda tudo localmente
easypanel.md        # passo a passo de deploy
```

## Rodar localmente (Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost
- API: http://localhost:3333/api
- Postgres: localhost:5432 (postgres/postgres)

Login inicial: `admin@local` / `admin123`

## Rodar localmente (sem Docker)

**1. Postgres**: tenha um Postgres rodando (local ou Docker).

**2. Backend**:
```bash
cd backend
cp .env.example .env  # edite DATABASE_URL e JWT_SECRET
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

**3. Frontend** (outro terminal):
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abra http://localhost:5173

## Deploy

Veja [`easypanel.md`](./easypanel.md).

## Stack

| Camada    | Tecnologia |
|-----------|------------|
| Frontend  | Vite, React 19, React Router, TanStack Query, Tailwind v4, axios |
| Backend   | Node 20, Express, Prisma 5, Zod, JWT, bcryptjs |
| Banco     | PostgreSQL 16 |
| Deploy    | Docker + Easypanel |

## Módulos prontos

- 🎨 **Branding**: nome do site, logo, favicon, cores, fontes — aplicado em tempo real via CSS vars
- 📄 **Páginas**: CRUD com slug, título, conteúdo JSON, publicar/despublicar
- 🧩 **Módulos**: cards de funcionalidade (blog, agenda, contato…) ativáveis
- 👥 **Usuários**: CRUD com papéis ADMIN / EDITOR
- 🔐 **Auth**: JWT, login email/senha, guard de rotas

A partir daqui é só adicionar os módulos específicos do seu projeto (ex: membros, células, eventos, doações).
