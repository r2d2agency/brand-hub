import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { 
  ShoppingBag, 
  MapPin, 
  MessageCircle, 
  ChevronRight,
  Gift,
  GraduationCap,
  Image as ImageIcon
} from "lucide-react";

export default function Home() {
  const branding = useBranding();

  const { data: banners = [] } = useQuery({
    queryKey: ["site-banners"],
    queryFn: async () => (await api.get("/site/banners")).data,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["site-stores"],
    queryFn: async () => (await api.get("/site/stores")).data,
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Basmar" className="h-10 w-10 object-contain" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">B</div>
            )}
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                BASMAR
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-widest text-pink-500 leading-none">
                Doces & Festas
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/categorias" className="hover:text-pink-500 transition-colors">Categorias</Link>
            <Link to="/pegue-monte" className="hover:text-pink-500 transition-colors">Pegue e Monte</Link>
            <Link to="/cursos" className="hover:text-pink-500 transition-colors">Cursos</Link>
            <Link to="/lojas" className="hover:text-pink-500 transition-colors">Nossas Lojas</Link>
            <Link to="/admin" className="rounded-full bg-slate-100 px-4 py-2 text-slate-500 hover:bg-slate-200 transition-colors">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-pink-500 py-20 text-white lg:py-32">
        <div className="absolute inset-0 opacity-10">
          {/* Decorative pattern could go here */}
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              Tudo para sua festa ser <span className="text-yellow-300 italic underline decoration-wavy underline-offset-8">inesquecível!</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-pink-100 lg:text-xl">
              Variedade em doces, embalagens, artigos de festa e kits exclusivos Pegue e Monte.
            </p>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <button className="rounded-full bg-white px-8 py-4 text-lg font-bold text-pink-500 shadow-xl shadow-pink-900/20 hover:scale-105 transition-transform">
                Ver Categorias
              </button>
              <button className="rounded-full bg-pink-600 border border-pink-400 px-8 py-4 text-lg font-bold text-white hover:bg-pink-700 transition-colors flex items-center gap-2">
                Falar no WhatsApp
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Explore nosso mundo</h2>
            <p className="mt-2 text-slate-500 font-medium">As melhores marcas e produtos para você.</p>
          </div>
          <Link to="/categorias" className="text-pink-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Ver todas <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length > 0 ? categories.map((cat: any) => (
            <Link 
              key={cat.id} 
              to={`/categoria/${cat.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all"
            >
              <div className="mb-4 h-48 overflow-hidden rounded-2xl bg-slate-100">
                {cat.coverImage && (
                  <img 
                    src={cat.coverImage} 
                    alt={cat.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{cat.description}</p>
            </Link>
          )) : (
            [1,2,3,4].map(i => (
              <div key={i} className="animate-pulse rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-4 h-48 rounded-2xl bg-slate-200"></div>
                <div className="h-6 w-2/3 rounded bg-slate-200"></div>
                <div className="mt-2 h-4 w-full rounded bg-slate-200"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <button className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform">
        <MessageCircle size={32} />
      </button>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="col-span-2">
              <span className="text-2xl font-black tracking-tight">BASMAR</span>
              <p className="mt-4 max-w-sm text-slate-400 font-medium">
                Sua parceira ideal para transformar qualquer comemoração em um momento mágico. Desde o doce até a decoração, estamos com você.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-slate-500 text-xs tracking-widest">Links Rápidos</h4>
              <nav className="flex flex-col gap-2 text-slate-400">
                <Link to="/p/sobre-nos" className="hover:text-white transition-colors">Sobre Nós</Link>
                <Link to="/lojas" className="hover:text-white transition-colors">Onde Estamos</Link>
                <Link to="/contato" className="hover:text-white transition-colors">Contato</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-slate-500 text-xs tracking-widest">Redes Sociais</h4>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 transition-colors cursor-pointer">IG</div>
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">FB</div>
              </div>
            </div>
          </div>
          <div className="mt-20 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2024 Basmar Doces & Artigos de Festas. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
