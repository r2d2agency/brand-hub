import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Populando banco de dados...')

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
  ]

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
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
  ]

  for (const store of stores) {
    await prisma.store.create({ data: store })
  }

  // Cursos
  await prisma.course.upsert({
    where: { slug: 'curso-confeitaria-basica' },
    update: {},
    create: {
      title: 'Curso de Confeitaria Básica',
      slug: 'curso-confeitaria-basica',
      description: 'Aprenda as técnicas fundamentais para começar na confeitaria.',
      instructor: 'Prof. Ana Silva',
      status: 'OPEN',
      date: new Date('2026-06-15T14:00:00Z'),
      location: 'Unidade Matriz - Auditório',
      whatsappMsg: 'Tenho interesse no curso de Confeitaria Básica.'
    }
  })

  // Pegue e Monte
  await prisma.pegueMonte.upsert({
    where: { slug: 'kit-festa-infantil-safari' },
    update: {},
    create: {
      name: 'Kit Safari Especial',
      slug: 'kit-festa-infantil-safari',
      theme: 'Safari',
      description: 'Kit completo com painel, mesa e suportes para doces.',
      items: ['Painel redondo', '3 Cilindros', '10 suportes de doces', 'Tapete gramado'],
      peopleCount: 'Até 30 pessoas',
      active: true,
      highlight: true,
      whatsappMsg: 'Quero reservar o Kit Safari!'
    }
  })

  // Branding Default
  await prisma.branding.upsert({
    where: { id: 'singleton' },
    update: { siteName: 'Basmar Doces', primaryColor: '#003399', accentColor: '#CC0000' },
    create: { id: 'singleton', siteName: 'Basmar Doces', primaryColor: '#003399', accentColor: '#CC0000' },
  })

  // Sobre Nós (Company History)
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
  })

  console.log('População finalizada com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
