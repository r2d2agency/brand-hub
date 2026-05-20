# Deploy no Easypanel

Este projeto tem 3 serviços: **Postgres**, **Backend** (Express + Prisma) e **Frontend** (Vite + nginx).
Tudo é deployado a partir do seu repositório GitHub.

## 1. Postgres

1. No Easypanel: **Create Service → Postgres**
2. Defina nome (ex: `app-db`), usuário e senha
3. Após criar, copie a **Connection URL interna**. Algo como:
   ```
   postgresql://postgres:SENHA@app_app-db:5432/postgres
   ```

## 2. Backend

1. **Create Service → App** → conecte seu repositório GitHub
2. **Source**:
   - Branch: `main`
   - Build path: `/backend`  <-- Contexto da pasta
3. **Build**: 
   - Selecione **Dockerfile**
   - Dockerfile path: `Dockerfile`  <-- Caminho relativo ao Build Path acima

4. **Environment**:
   ```
   DATABASE_URL=postgresql://postgres:SENHA@app_app-db:5432/postgres
   JWT_SECRET=<gere uma string aleatória longa>
   JWT_EXPIRES_IN=7d
   PORT=3333
   CORS_ORIGIN=https://seu-dominio.com
   ADMIN_EMAIL=admin@seudominio.com
   ADMIN_PASSWORD=<senha forte inicial>
   ADMIN_NAME=Administrador
   ```
5. **Ports**: exponha a porta `3333`
6. **Domain**: adicione `api.seudominio.com` → SSL automático (Let's Encrypt)
7. Faça o deploy. O container roda automaticamente `prisma migrate deploy` e `prisma/seed.ts` no boot.


## 3. Frontend

1. **Create Service → App** → mesmo repositório GitHub
2. **Source**:
   - Branch: `main`
   - Build path: `/frontend`
3. **Build**: Dockerfile (`frontend/Dockerfile`)
4. **Build args**:
   ```
   VITE_API_URL=https://api.seudominio.com/api
   ```
   ⚠️ Importante: é **build arg**, não env var de runtime — o Vite injeta no bundle no momento do build.
5. **Ports**: porta `80`
6. **Domain**: `seudominio.com` (ou `www.seudominio.com`) → SSL automático

## 4. Atualizações futuras

- Cada `git push` no branch configurado dispara redeploy automático.
- Migrações novas: edite `backend/prisma/schema.prisma`, rode localmente `npx prisma migrate dev --name nome_da_mudanca`, commit. No deploy, o container roda `prisma migrate deploy` sozinho.

## Login inicial

Após o seed, acesse `https://seudominio.com/login`:
- Email: o valor de `ADMIN_EMAIL`
- Senha: o valor de `ADMIN_PASSWORD`

**Troque a senha** criando um novo usuário admin pelo painel e desativando o inicial, ou rode um update direto no banco.
