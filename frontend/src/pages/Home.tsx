import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  ChevronRight, 
  MessageCircle, 
  Play
} from "lucide-react";

export default function Home() {
  const { data: categories = [] } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  return (
    <div className="bg-slate-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-16 md:py-20 text-white lg:py-32">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6">
              Desde 1991
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight lg:text-7xl">
              Tudo para sua festa ser <span className="text-red-500 italic">inesquecível!</span>
            </h1>
            <p className="mt-6 text-base md:text-lg font-medium text-blue-100 lg:text-xl">
              Variedade em doces, embalagens, artigos de festa e kits exclusivos Pegue e Monte.
            </p>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <button className="rounded-full bg-red-600 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold text-white shadow-xl shadow-red-900/40 hover:bg-red-700 hover:scale-105 transition-all w-full sm:w-auto">
                Ver Categorias
              </button>
              <button className="rounded-full bg-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold text-blue-900 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                Falar no WhatsApp
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Nossa Vitrine</div>
            <h2 className="text-3xl md:text-4xl font-black text-blue-900">Explore nosso mundo</h2>
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

      {/* Videos Section */}
      <section className="bg-blue-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Momento Basmar</div>
            <h2 className="text-3xl md:text-4xl font-black text-blue-900">Dicas e Novidades</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-video relative rounded-3xl bg-slate-200 overflow-hidden shadow-lg group">
                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block rounded-lg bg-red-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                    Dica da Semana
                  </div>
                  <h4 className="text-lg font-bold text-white drop-shadow-md">Como montar sua festa em casa</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-red-600 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl md:text-3xl font-black">Vai ter festa? Vem pra Basmar!</h3>
            <p className="mt-2 text-red-100 font-medium">Atendimento personalizado por WhatsApp em todas as lojas.</p>
          </div>
          <button className="rounded-full bg-white px-8 py-4 font-bold text-red-600 hover:bg-blue-900 hover:text-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto">
            <MessageCircle size={20} />
            Chamar no WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}
