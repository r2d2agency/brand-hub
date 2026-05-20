// Templates prontos para banners da Basmar Doces
// Imagens otimizadas do Unsplash (free for commercial use)

export interface BannerTemplate {
  id: string;
  name: string;
  category: string;
  preview: string; // thumbnail URL
  data: {
    title: string;
    subtitle: string;
    imageDesktop: string;
    imageMobile?: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const BANNER_TEMPLATES: BannerTemplate[] = [
  {
    id: "doces-coloridos",
    name: "Festival de Doces",
    category: "Geral",
    preview: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Festival de Doces",
      subtitle: "Variedade infinita para adoçar seus momentos especiais.",
      imageDesktop: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Ver Catálogo",
      buttonLink: "/categorias"
    }
  },
  {
    id: "festa-infantil",
    name: "Festa Infantil",
    category: "Festa",
    preview: "https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Festa Infantil dos Sonhos",
      subtitle: "Decoração, doces e tudo para o dia mais feliz das crianças.",
      imageDesktop: "https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1530103862676-fa8c9d34bb34?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Montar Festa",
      buttonLink: "/pegue-monte"
    }
  },
  {
    id: "chocolate-premium",
    name: "Chocolate Premium",
    category: "Categoria",
    preview: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Chocolates Premium",
      subtitle: "Marcas exclusivas para sua confeitaria atingir o próximo nível.",
      imageDesktop: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Ver Chocolates",
      buttonLink: "/categoria/chocolates"
    }
  },
  {
    id: "pascoa",
    name: "Páscoa",
    category: "Sazonal",
    preview: "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Páscoa Especial",
      subtitle: "Tudo para fazer ovos, embalagens e decoração temática.",
      imageDesktop: "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Ver Coleção Páscoa",
      buttonLink: "/categorias"
    }
  },
  {
    id: "natal",
    name: "Natal Mágico",
    category: "Sazonal",
    preview: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Natal Mágico",
      subtitle: "Panetones, embalagens e doces especiais para a ceia.",
      imageDesktop: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Coleção de Natal",
      buttonLink: "/categorias"
    }
  },
  {
    id: "cupcakes",
    name: "Confeitaria Caseira",
    category: "Categoria",
    preview: "https://images.unsplash.com/photo-1426869981800-95ebf51ce900?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Confeitaria Caseira",
      subtitle: "Insumos e utensílios para boleiras e confeiteiros profissionais.",
      imageDesktop: "https://images.unsplash.com/photo-1426869981800-95ebf51ce900?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1426869981800-95ebf51ce900?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Ver Insumos",
      buttonLink: "/categoria/confeitaria"
    }
  },
  {
    id: "baloes",
    name: "Mundo dos Balões",
    category: "Categoria",
    preview: "https://images.unsplash.com/photo-1530819568329-97653eafbbfa?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Mundo dos Balões",
      subtitle: "Látex, metalizados e bouquets para decorar qualquer ambiente.",
      imageDesktop: "https://images.unsplash.com/photo-1530819568329-97653eafbbfa?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1530819568329-97653eafbbfa?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Ver Balões",
      buttonLink: "/categoria/baloes"
    }
  },
  {
    id: "casamento",
    name: "Casamento & Eventos",
    category: "Festa",
    preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Casamento dos Sonhos",
      subtitle: "Bem casados, mesas de doces e decoração para o grande dia.",
      imageDesktop: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Falar com Consultor",
      buttonLink: "#whatsapp"
    }
  },
  {
    id: "promocao",
    name: "Mega Promoção",
    category: "Geral",
    preview: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=600",
    data: {
      title: "Mega Promoção",
      subtitle: "Doces, embalagens e artigos com até 50% OFF. Por tempo limitado!",
      imageDesktop: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=2070",
      imageMobile: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=1000",
      buttonText: "Aproveitar Agora",
      buttonLink: "/categorias"
    }
  }
];

export const TEMPLATE_CATEGORIES = ["Todos", "Geral", "Sazonal", "Festa", "Categoria"];
