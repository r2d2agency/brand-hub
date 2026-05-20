
# Plano: ambiente self-hosted (Easypanel) com frontend e backend separados

Vou reorganizar o projeto em duas pastas independentes, cada uma com seu próprio `package.json`, Dockerfile e build, conectadas a um Postgres gerenciado pelo Easypanel.

## Estrutura final do repositório

```text
/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts            # cria admin inicial + branding default
│   ├── src/
│   │   ├── index.ts           # bootstrap Express
│   │   ├── env.ts             # validação de env com zod
│   │   ├── prisma.ts          # PrismaClient singleton
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT + role guard
│   │   │   └── error.ts
│   │   ├── modules/
│   │   │   ├── auth/          # login, me, refresh
│   │   │   ├── users/         # CRUD usuários admin
│   │   │   ├── branding/      # GET público + PUT admin
│   │   │   ├── pages/         # CRUD páginas (slug, título, conteúdo)
│   │   │   └── modules/       # CRUD "módulos" (cards de funcionalidade)
│   │   └── routes.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── lib/
│   │   │   ├── api.ts         # axios + interceptor JWT
│   │   │   └── auth.tsx       # contexto + ProtectedRoute
│   │   ├── pages/
│   │   │   ├── Home.tsx       # site público (usa branding)
│   │   │   ├── Login.tsx
│   │   │   └── admin/
│   │   │       ├── Layout.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── Branding.tsx
│   │   │       ├── Pages.tsx
│   │   │       ├── Modules.tsx
│   │   │       └── Users.tsx
│   │   └── components/ui/     # shadcn reaproveitado
│   ├── Dockerfile             # build Vite + nginx serve
│   ├── nginx.conf
│   ├── vite.config.ts
│   ├── package.json
│   └── .env.example           # VITE_API_URL
│
├── docker-compose.yml         # postgres + backend + frontend (uso local)
├── easypanel.md               # passo a passo de deploy
└── README.md
```

A pasta `src/` atual do TanStack Start será removida e substituída pela nova estrutura. Componentes `shadcn/ui` serão copiados para `frontend/src/components/ui`.

## Backend (Express + Prisma + JWT)

**Schema Prisma inicial:**

- `User` — id, email (unique), passwordHash, name, role (`ADMIN` | `EDITOR`), timestamps
- `Branding` — singleton (id fixo), siteName, logoUrl, faviconUrl, primaryColor, secondaryColor, accentColor, fontHeading, fontBody
- `Page` — id, slug (unique), title, content (Json), published, seoTitle, seoDescription, order, timestamps
- `Module` — id, key (unique), title, description, icon, enabled, config (Json), order, timestamps

**Endpoints:**

- `POST /api/auth/login` → `{ token, user }`
- `GET  /api/auth/me`
- `GET  /api/branding` (público) · `PUT /api/branding` (admin)
- `GET  /api/pages` · `GET /api/pages/:slug` · `POST/PUT/DELETE` (admin)
- `GET  /api/modules` · `POST/PUT/DELETE /api/modules/:id` (admin)
- `GET  /api/users` · `POST/PUT/DELETE` (admin)

JWT em header `Authorization: Bearer …`, `bcrypt` para senha, `zod` para validação, `cors` configurado por env.

## Frontend (Vite + React + Router + shadcn)

- Vite 7 + React 19 + TypeScript
- `react-router-dom` para rotas
- `@tanstack/react-query` para data fetching
- Axios com interceptor que injeta JWT do `localStorage`
- Tailwind v4 + tokens semânticos lidos da API de Branding (CSS vars aplicadas em runtime no `<html>`)
- Site público (`/`, `/:slug`) consome `/api/branding` + `/api/pages`
- `/login` e `/admin/*` com guard

## Deploy Easypanel

`easypanel.md` cobrirá:

1. Criar serviço **Postgres** (Easypanel template) → copiar `DATABASE_URL`
2. Criar serviço **Backend** (App via GitHub, build path `backend/`, Dockerfile)
   - Envs: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT=3333`
   - Comando de start já roda `prisma migrate deploy && node dist/index.js`
3. Criar serviço **Frontend** (App via GitHub, build path `frontend/`, Dockerfile)
   - Env de build: `VITE_API_URL=https://api.seudominio.com`
4. Configurar domínios + SSL (Let's Encrypt automático)

`docker-compose.yml` permite rodar tudo localmente com 1 comando (`docker compose up`).

## Seed inicial

Cria automaticamente:
- Admin: `admin@local` / senha definida em `ADMIN_PASSWORD` (env)
- Branding padrão (cores neutras, nome do site placeholder)
- 1 página "Início" e 3 módulos de exemplo

## O que NÃO vou fazer agora

- Não vou ativar Lovable Cloud (você quer self-hosted).
- Não vou criar funcionalidade específica de igreja ainda — só o esqueleto CRUD. Os módulos específicos entram depois que você confirmar o ambiente.
- Não vou publicar pelo Lovable; o deploy é via seu GitHub → Easypanel.

Quando aprovar, executo tudo de uma vez (remover scaffold antigo, criar as duas pastas, schemas, rotas, telas admin, Dockerfiles e docs de deploy).
