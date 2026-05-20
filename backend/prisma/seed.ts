import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@local";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const name = process.env.ADMIN_NAME ?? "Administrador";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name, role: Role.ADMIN },
  });

  await prisma.branding.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", siteName: "Meu Site", tagline: "Bem-vindo" },
  });

  await prisma.page.upsert({
    where: { slug: "inicio" },
    update: {},
    create: {
      slug: "inicio",
      title: "Início",
      content: { blocks: [{ type: "text", value: "Conteúdo inicial editável pelo admin." }] },
      order: 0,
    },
  });

  const modules = [
    { key: "blog", title: "Blog", description: "Publicações e notícias", icon: "newspaper" },
    { key: "agenda", title: "Agenda", description: "Eventos e calendário", icon: "calendar" },
    { key: "contato", title: "Contato", description: "Formulário de contato", icon: "mail" },
  ];
  for (const [i, m] of modules.entries()) {
    await prisma.module.upsert({
      where: { key: m.key },
      update: {},
      create: { ...m, order: i },
    });
  }

  console.log(`✅ Seed concluído. Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
