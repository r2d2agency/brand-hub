import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { useParams, Link } from "react-router-dom";
import { PartyPopper, ChevronLeft, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";

export default function PegueMonteDetails() {
  const { slug } = useParams();
  const branding = useBranding();

  const { data: kit, isLoading, error } = useQuery({
    queryKey: ["site-pegue-monte", slug],
    queryFn: async () => (await api.get(`/site/pegue-monte/${slug}`)).data,
  });

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Olá! Tenho interesse no kit Pegue e Monte: ${kit?.name}. Gostaria de mais informações.`);
    window.open(`https://wa.me/${branding?.whatsappPhone?.replace(/\D/g, '') || '5511999999999'}?text=${msg}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Carregando detalhes...</div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black text-blue-900 mb-4">Kit não encontrado</h1>
        <p className="text-slate-500 mb-8">O kit que você está procurando não existe ou foi removido.</p>
        <Link to="/pegue-monte" className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold">
          Voltar para Lista
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link to="/pegue-monte" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-900 font-bold uppercase text-[10px] tracking-[0.2em] transition-all mb-12 hover:-translate-x-1">
          <ChevronLeft size={14} />
          Explorar Coleções
        </Link>

        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Image & Video Gallery Side */}
          <div className="space-y-6 sticky top-32">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-blue-900/5 group relative">
              {kit.coverImage ? (
                <img src={kit.coverImage} alt={kit.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-900/5">
                  <PartyPopper size={80} />
                </div>
              )}
              
              {kit.theme && (
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-blue-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
                  {kit.theme}
                </div>
              )}
            </div>
            
            {(kit.gallery && kit.gallery.length > 0) && (
              <div className="grid grid-cols-4 gap-4">
                {kit.gallery.map((img: string, idx: number) => (
                  <button key={idx} className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 hover:ring-2 ring-red-500/50 transition-all">
                    <img src={img} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Support Placeholder/Info */}
            {kit.videoUrl && (
              <div className="aspect-video rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl relative group">
                <iframe 
                  src={`https://www.youtube.com/embed/${kit.videoUrl.split('v=')[1] || kit.videoUrl.split('/').pop()}`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Info Side - More Compact & Refined */}
          <div className="flex flex-col pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6 self-start">
              <Sparkles size={12} />
              Curadoria Exclusiva
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-blue-900 leading-[1.1] mb-6 tracking-tight">{kit.name}</h1>
            
            <div className="h-1 w-12 bg-red-600 rounded-full mb-10"></div>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {kit.description || "Uma composição harmônica desenvolvida para elevar o nível da sua celebração com sofisticação e praticidade."}
              </p>
            </div>

            {kit.items && kit.items.length > 0 && (
              <div className="mb-12 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-blue-900 mb-8 uppercase tracking-[0.2em]">Composição do Kit</h3>
                <ul className="grid gap-5">
                  {kit.items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-600 font-medium text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6 bg-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20">
              <div className="space-y-2">
                <h4 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em]">Disponibilidade</h4>
                <p className="text-xl font-bold">Reserve para sua data</p>
              </div>
              
              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white py-5 text-sm font-black uppercase tracking-[0.1em] text-blue-900 hover:bg-red-600 hover:text-white transition-all active:scale-95 group"
              >
                <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                Consultar via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
