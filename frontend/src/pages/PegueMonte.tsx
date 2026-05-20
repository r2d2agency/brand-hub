import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { PartyPopper, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function PegueMonte() {
  const branding = useBranding();

  const { data: kits = [], isLoading } = useQuery({
    queryKey: ["site-pegue-monte"],
    queryFn: async () => (await api.get("/site/pegue-monte")).data,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Carregando kits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden" style={{ backgroundColor: branding?.primaryColor || '#1e3a8a' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
            <Sparkles size={14} />
            Celebre com Estilo
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight">Pegue e Monte</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl font-medium opacity-90 leading-relaxed">
            Kits completos e decorados para transformar qualquer comemoração em um momento inesquecível. Escolha o seu favorito e reserve agora.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {kits.map((kit: any) => (
            <Link 
              key={kit.id} 
              to={`/pegue-monte/${kit.slug || kit.id}`}
              className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                {kit.coverImage ? (
                  <img 
                    src={kit.coverImage} 
                    alt={kit.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-900/10">
                    <PartyPopper size={60} />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="bg-white/90 backdrop-blur-md text-blue-900 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    Explorar <ChevronRight size={14} />
                  </span>
                </div>

                {kit.theme && (
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-blue-900 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {kit.theme}
                  </div>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-lg font-black text-blue-900 group-hover:text-red-600 transition-colors leading-tight line-clamp-1">
                  {kit.name}
                </h3>
                <p className="mt-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Ver Coleção
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        {kits.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <PartyPopper size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">Novos kits em breve</p>
          </div>
        )}
      </section>
    </div>
  );
}
