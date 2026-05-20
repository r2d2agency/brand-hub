import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ChevronRight, MessageCircle } from "lucide-react";
import logoBasmar from "@/assets/logo-basmar.png";

export default function Home() {
  const { data: categories = [] } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-red-600 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center">
            <img src={logoBasmar} alt="Basmar Doces e Artigos de Festas" className="h-14 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-bold uppercase tracking-wide text-blue-900">
            <Link to="/categorias" className="hover:text-red-600 transition-colors">Categorias</Link>
            <Link to="/pegue-monte" className="hover:text-red-600 transition-colors">Pegue e Monte</Link>
            <Link to="/cursos" className="hover:text-red-600 transition-colors">Cursos</Link>
            <Link to="/lojas" className="hover:text-red-600 transition-colors">Lojas</Link>
            <Link to="/contato" className="hover:text-red-600 transition-colors">Contato</Link>
            <Link to="/admin" className="rounded-full bg-blue-900 px-4 py-2 text-white hover:bg-blue-800 transition-colors">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 text-white lg:py-32">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6">
              Desde 1991
            </div>
            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              Tudo para sua festa ser <span className="text-red-500 italic">inesquecível!</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-blue-100 lg:text-xl">
              Variedade em doces, embalagens, artigos de festa e kits exclusivos Pegue e Monte.
            </p>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <button className="rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-red-900/40 hover:bg-red-700 hover:scale-105 transition-all">
                Ver Categorias
              </button>
              <button className="rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-900 hover:bg-blue-50 transition-colors flex items-center gap-2">
                Falar no WhatsApp
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Nossa Vitrine</div>
            <h2 className="text-4xl font-black text-blue-900">Explore nosso mundo</h2>
            <p className="mt-2 text-slate-500 font-medium">As melhores marcas e produtos para você.</p>
          </div>
          <Link to="/categorias" className="text-red-600 font-bold flex items-center gap-1 hover:gap-2 transition-all uppercase text-sm tracking-wide">
            Ver todas <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length > 0 ? categories.map((cat: any) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-md border-2 border-transparent hover:border-red-600 hover:shadow-2xl transition-all"
            >
              <div className="h-48 overflow-hidden bg-blue-50">
                {cat.coverImage && (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-blue-900 group-hover:text-red-600 transition-colors">{cat.name}</h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          )) : (
            [
              "Doces", "Chocolates", "Balas", "Confeitaria",
              "Embalagens", "Balões", "Artigos de Festa", "Personalizados"
            ].map((name, i) => (
              <div key={i} className="group rounded-3xl bg-white shadow-md border-2 border-transparent hover:border-red-600 hover:shadow-2xl transition-all overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center">
                  <span className="text-5xl font-black text-blue-900/20">{name.charAt(0)}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-blue-900 group-hover:text-red-600 transition-colors">{name}</h3>
                  <p className="mt-2 text-sm text-slate-500">Variedade completa para você.</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-red-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-3xl font-black">Vai ter festa? Vem pra Basmar!</h3>
            <p className="mt-2 text-red-100 font-medium">Atendimento personalizado por WhatsApp em todas as lojas.</p>
          </div>
          <button className="rounded-full bg-white px-8 py-4 font-bold text-red-600 hover:bg-blue-900 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap">
            <MessageCircle size={20} />
            Chamar no WhatsApp
          </button>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="#"
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform"
      >
        <MessageCircle size={32} />
      </a>

      {/* Footer */}
      <footer className="bg-blue-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="col-span-2">
              <img src={logoBasmar} alt="Basmar" className="h-16 w-auto object-contain bg-white/5 rounded-lg p-2 inline-block" />
              <p className="mt-4 max-w-sm text-blue-200 font-medium">
                Sua parceira ideal para transformar qualquer comemoração em um momento mágico. Desde o doce até a decoração, estamos com você desde 1991.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 uppercase text-red-500 text-xs tracking-widest">Navegue</h4>
              <nav className="flex flex-col gap-2 text-blue-200">
                <Link to="/p/sobre-nos" className="hover:text-white transition-colors">Sobre Nós</Link>
                <Link to="/lojas" className="hover:text-white transition-colors">Onde Estamos</Link>
                <Link to="/cursos" className="hover:text-white transition-colors">Cursos</Link>
                <Link to="/contato" className="hover:text-white transition-colors">Contato</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-black mb-4 uppercase text-red-500 text-xs tracking-widest">Redes Sociais</h4>
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-full bg-blue-900 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer font-bold text-sm">IG</div>
                <div className="h-11 w-11 rounded-full bg-blue-900 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer font-bold text-sm">FB</div>
                <div className="h-11 w-11 rounded-full bg-blue-900 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer font-bold text-sm">WA</div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-blue-900 pt-8 text-center text-sm text-blue-300">
            © {new Date().getFullYear()} Basmar Doces & Artigos de Festas. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
