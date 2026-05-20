import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, PartyPopper } from "lucide-react";
import { useBranding } from "@/lib/branding";

export default function PegueMonteHome() {
  const branding = useBranding();
  const { data: kits = [] } = useQuery({
    queryKey: ["site-pegue-monte-home"],
    queryFn: async () => (await api.get("/site/pegue-monte")).data,
  });

  if (!kits || kits.length === 0) return null;

  // Take only the first 4 for home
  const displayKits = kits.slice(0, 4);

  return (
    <section className="relative py-32 overflow-hidden bg-white/50 backdrop-blur-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>


      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              Celebre com Estilo
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 leading-tight">
              Pegue e Monte <br />
              <span className="text-red-600">Sua Festa Mágica</span>
            </h2>
            <p className="mt-4 text-slate-500 font-medium max-w-xl text-lg">
              Kits completos e decorados para transformar qualquer comemoração em um momento inesquecível. Praticidade e beleza para você.
            </p>
          </div>
          
          <Link 
            to="/pegue-monte" 
            className="group relative inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-bold transition-all hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-900/20 active:scale-95"
          >
            Explorar Todos os Kits
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayKits.map((kit: any) => (
            <Link 
              key={kit.id}
              to={`/pegue-monte/${kit.slug || kit.id}`}
              className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                {kit.coverImage ? (
                  <img 
                    src={kit.coverImage} 
                    alt={kit.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center">
                    <PartyPopper size={40} className="text-blue-900/20" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="bg-white/90 backdrop-blur-md text-blue-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    Explorar <ChevronRight size={14} />
                  </span>
                </div>

                {kit.highlight && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-red-600 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    Destaque
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-black text-blue-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                  {kit.name}
                </h3>
                <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Ver Coleção
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
