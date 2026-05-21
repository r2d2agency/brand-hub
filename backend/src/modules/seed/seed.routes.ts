import { Router } from "express";
import { prisma } from "../../prisma.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const seedRouter = Router();

seedRouter.post("/", async (req, res, next) => {
  try {
    console.log('Populando banco de dados via endpoint...');

    // Tentativa de rodar db push para garantir que as tabelas existam
    try {
      console.log('Tentando sincronizar tabelas com db push...');
      // Note: Em ambientes serverless isso pode falhar dependendo das restrições
      // No Easypanel (Docker), deve funcionar se o npx estiver disponível
      await execAsync("npx prisma db push --accept-data-loss");
      console.log('Tabelas sincronizadas com sucesso.');
    } catch (dbErr) {
      console.error('Erro ao rodar db push:', dbErr);
      // Continuamos mesmo se falhar, pois o erro P2021 pode ser resolvido se o Easypanel 
      // rodar as migrações que criamos manualmente agora.
    }

    // Categorias
    const categories = [
      { name: 'Doces', slug: 'doces', description: 'Guloseimas, pirulitos, chicletes e muito mais.', whatsappMsg: 'Gostaria de saber mais sobre os doces.' },
      { name: 'Chocolates', slug: 'chocolates', description: 'Barras, bombons e chocolates para confeitaria.', whatsappMsg: 'Gostaria de saber mais sobre os chocolates.' },
      { name: 'Balas', slug: 'balas', description: 'Balas de goma, mastigáveis e tradicionais.', whatsappMsg: 'Gostaria de saber mais sobre as balas.' },
      { name: 'Confeitaria', slug: 'confeitaria', description: 'Ingredientes e utensílios para boleiras e confeiteiros.', whatsappMsg: 'Gostaria de saber mais sobre itens de confeitaria.' },
      { name: 'Embalagens', slug: 'embalagens', description: 'Caixas, sacos de presente e embalagens para doces.', whatsappMsg: 'Gostaria de saber mais sobre as embalagens.' },
      { name: 'Artigos para Festa', slug: 'artigos-festa', description: 'Decoração completa para sua comemoração.', whatsappMsg: 'Gostaria de saber mais sobre artigos para festa.' },
      { name: 'Balões', slug: 'baloes', description: 'Balões de látex, metalizados e acessórios.', whatsappMsg: 'Gostaria de saber mais sobre os balões.' },
      { name: 'Descartáveis', slug: 'descartaveis', description: 'Pratos, copos e talheres para sua festa.', whatsappMsg: 'Gostaria de saber mais sobre os descartáveis.' },
    ];

    for (const cat of categories) {
      await prisma.productCategory.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
    }

    // Lojas
    const stores = [
      { 
        name: 'Basmar - Unidade Matriz', 
        address: 'Rua Principal, 123', 
        neighborhood: 'Centro', 
        phone: '(11) 1234-5678', 
        whatsapp: '5511999999999',
        hours: 'Seg a Sex: 08h às 18h | Sáb: 08h às 13h',
        mapsLink: 'https://goo.gl/maps/example1'
      },
      { 
        name: 'Basmar - Unidade Shopping', 
        address: 'Av. das Américas, 500', 
        neighborhood: 'Vila Nova', 
        phone: '(11) 8765-4321', 
        whatsapp: '5511888888888',
        hours: 'Seg a Sáb: 10h às 22h | Dom: 14h às 20h',
        mapsLink: 'https://goo.gl/maps/example2'
      }
    ];

    await prisma.store.deleteMany({});
    for (const store of stores) {
      await prisma.store.create({ data: store });
    }

    // Sobre Nós
    await prisma.companyHistory.upsert({
      where: { id: 'singleton' },
      update: { 
        title: 'Nossa História', 
        content: 'Fundada em 1991, a Basmar nasceu do sonho de levar alegria e doçura para todas as famílias...',
        timeline: [
          { year: '1991', title: 'Fundação', desc: 'Abertura da primeira loja.' },
          { year: '2010', title: 'Expansão', desc: 'Inauguração da unidade shopping.' }
        ]
      },
      create: { 
        id: 'singleton', 
        title: 'Nossa História', 
        content: 'Fundada em 1991, a Basmar nasceu do sonho de levar alegria e doçura para todas as famílias...',
        timeline: [
          { year: '1991', title: 'Fundação', desc: 'Abertura da primeira loja.' },
          { year: '2010', title: 'Expansão', desc: 'Inauguração da unidade shopping.' }
        ]
      },
    });

    // Banners Sazonais (Hero Slider)
    const banners = [
      {
        title: "Tudo para sua festa ser inesquecível",
        subtitle: "Variedade em doces, embalagens e artigos para festa com os melhores preços.",
        imageDesktop: "https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?auto=format&fit=crop&q=80&w=2070",
        imageMobile: "https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?auto=format&fit=crop&q=80&w=1000",
        buttonText: "Ver Promoções",
        buttonLink: "/categorias",
        active: true,
        order: 1
      },
      {
        title: "Kits Pegue e Monte Exclusivos",
        subtitle: "Praticidade e beleza para sua comemoração em casa. Diversos temas disponíveis.",
        imageDesktop: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=2036",
        imageMobile: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=1000",
        buttonText: "Conhecer Kits",
        buttonLink: "/pegue-monte",
        active: true,
        order: 2
      }
    ];

    for (const banner of banners) {
      await prisma.seasonalBanner.create({ data: banner });
    }

    res.json({ ok: true, message: 'Banco de dados populado com sucesso!' });
  } catch (e) {
    next(e);
  }
});

