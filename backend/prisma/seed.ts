import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Populando banco de dados...')

  // Categorias
  const categories = [
    { name: 'Doces e Guloseimas', slug: 'doces', description: 'Guloseimas, pirulitos, chicletes e muito mais.', whatsappMsg: 'Gostaria de saber mais sobre os doces.', coverImage: '/seed/cat-doces.jpg', icon: 'Candy', order: 1 },
    { name: 'Embalagens', slug: 'embalagens', description: 'Caixas, sacos de presente e embalagens para doces.', whatsappMsg: 'Gostaria de saber mais sobre as embalagens.', coverImage: '/seed/cat-embalagens.jpg', icon: 'Gift', order: 2 },
    { name: 'Confeitaria', slug: 'confeitaria', description: 'Ingredientes e utensílios para boleiras e confeiteiros.', whatsappMsg: 'Gostaria de saber mais sobre itens de confeitaria.', coverImage: '/seed/cat-confeitaria.jpg', icon: 'ChefHat', order: 3 },
    { name: 'Decoração de Festa', slug: 'decoracao-festa', description: 'Decoração completa para sua comemoração.', whatsappMsg: 'Gostaria de saber mais sobre decoração.', coverImage: '/seed/cat-decoracao.jpg', icon: 'PartyPopper', order: 4 },
    { name: 'Descartáveis', slug: 'descartaveis', description: 'Pratos, copos e talheres para sua festa.', whatsappMsg: 'Gostaria de saber mais sobre os descartáveis.', coverImage: '/seed/cat-descartaveis.jpg', icon: 'CupSoda', order: 5 },
    { name: 'Pegue e Monte', slug: 'pegue-e-monte', description: 'Monte sua festa com nossos kits prontos.', whatsappMsg: 'Quero saber sobre o Pegue e Monte.', coverImage: '/seed/cat-pegue-monte.jpg', icon: 'Package', order: 6 },
    { name: 'Cursos', slug: 'cursos', description: 'Aprenda com nossos cursos especializados.', whatsappMsg: 'Quero saber sobre os cursos.', coverImage: '/seed/cat-cursos.jpg', icon: 'GraduationCap', order: 7 },
    { name: 'Galeria de Produtos', slug: 'galeria', description: 'Veja nossa galeria completa.', whatsappMsg: 'Quero ver a galeria de produtos.', coverImage: '/seed/cat-galeria.jpg', icon: 'Camera', order: 8 },
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
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-000',
      phone: '(11) 1234-5678', 
      whatsapp: '5511999999999',
      hours: 'Seg a Sex: 08h às 18h | Sáb: 08h às 13h',
      mapsLink: 'https://goo.gl/maps/example1'
    },
    { 
      name: 'Basmar - Unidade Shopping', 
      address: 'Av. das Américas, 500', 
      neighborhood: 'Vila Nova', 
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22631-000',
      phone: '(11) 8765-4321', 
      whatsapp: '5511888888888',
      hours: 'Seg a Sáb: 10h às 22h | Dom: 14h às 20h',
      mapsLink: 'https://goo.gl/maps/example2'
    }
  ]

  // Primeiro limpamos lojas antigas para evitar duplicatas
  await prisma.store.deleteMany({})

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

  // Promoções
  const promos = [
    { id: 'promo-1', title: 'Chocolate Nestlé 1kg', price: '49,90', oldPrice: '59,90', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1935&auto=format&fit=crop' },
    { id: 'promo-2', title: 'Balas de Goma 500g', price: '12,90', oldPrice: '15,90', image: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?q=80&w=2030&auto=format&fit=crop' },
  ]

  // Primeiro limpamos promoções antigas para evitar duplicatas infinitas
  await prisma.promotion.deleteMany({})

  for (const promo of promos) {
    await prisma.promotion.create({ data: promo })
  }

  // Benefits
  const benefits = [
    { icon: 'Truck', title: 'Entrega Rápida', subtitle: 'Para toda a região', order: 1 },
    { icon: 'ShieldCheck', title: 'Compra Segura', subtitle: 'Ambiente protegido', order: 2 },
    { icon: 'CreditCard', title: 'Parcelamento', subtitle: 'Em até 10x sem juros', order: 3 },
    { icon: 'Headphones', title: 'Atendimento', subtitle: 'Equipe especializada', order: 4 },
  ]
  await prisma.benefit.deleteMany({})
  for (const b of benefits) await prisma.benefit.create({ data: b })

  // Inspirações
  const inspirations = [
    { title: 'Festa Safari', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop', order: 1 },
    { title: 'Festa Princesas', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop', order: 2 },
    { title: 'Festa Unicórnio', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=1200&auto=format&fit=crop', order: 3 },
    { title: 'Festa Junina', image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=1200&auto=format&fit=crop', order: 4 },
    { title: 'Festa Tropical', image: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?q=80&w=1200&auto=format&fit=crop', order: 5 },
    { title: 'Casamento', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', order: 6 },
  ]
  await prisma.inspiration.deleteMany({})
  for (const i of inspirations) await prisma.inspiration.create({ data: i })

  // Home Banners
  const homeBanners = [
    { key: 'courses-promo', title: 'Cursos Basmar', subtitle: 'Aprenda com quem entende', description: 'Confeitaria, decoração e muito mais. Vagas limitadas!', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop', ctaText: 'Ver cursos', ctaLink: '/cursos', bgColor: '#dc2626', order: 1 },
    { key: 'about-store', title: 'Sobre a Basmar', subtitle: 'Desde 1991 com você', description: 'Há mais de 30 anos transformando festas em momentos inesquecíveis.', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop', ctaText: 'Conheça nossa história', ctaLink: '/sobre', bgColor: '#1e3a8a', order: 2 },
  ]
  for (const b of homeBanners) {
    await prisma.homeBanner.upsert({ where: { key: b.key }, update: b, create: b })
  }

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
