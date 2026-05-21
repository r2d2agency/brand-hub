#!/bin/sh
set -e

echo "🚀 Iniciando ambiente de banco de dados..."

# Tenta rodar as migrações. 
# Se falhar com erro P3005 (database not empty) e for a primeira vez, 
# podemos tentar resolver marcando a 0_init como aplicada.
if npx prisma migrate deploy; then
  echo "✅ Migrações aplicadas com sucesso."
else
  echo "⚠️ Falha nas migrações. Tentando baseline (resolve 0_init)..."
  npx prisma migrate resolve --applied 0_init || echo "ℹ️ Não foi possível fazer o baseline, talvez já tenha sido feito."
  npx prisma migrate deploy
fi

echo "🔧 Executando fix-schema via dist/fix-schema.js..."
node -e "import('./dist/fix-schema.js').then(m => m.fixSchema())" || echo "⚠️ Falha ao rodar fix-schema."

echo "🌱 Rodando seed..."
npx tsx prisma/seed.ts

echo "🏁 Iniciando aplicação..."
exec node dist/index.js
