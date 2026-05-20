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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link to="/pegue-monte" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-900 font-bold uppercase text-xs tracking-widest transition-colors mb-8">
          <ChevronLeft size={16} />
          Voltar para kits
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Gallery Side */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-2xl">
              {kit.coverImage ? (
                <img src={kit.coverImage} alt={kit.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-900/10">
                  <PartyPopper size={120} />
                </div>
              )}
            </div>
            
            {kit.gallery && kit.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {kit.gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img src={img} className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Side */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest mb-6 self-start">
              <Sparkles size={14} />
              Kit Exclusivo
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-blue-900 leading-tight mb-4">{kit.name}</h1>
            
            {kit.theme && (
              <div className="text-blue-600 font-bold uppercase text-sm tracking-widest mb-6">
                Tema: {kit.theme}
              </div>
            )}

            <div className="h-1.5 w-20 bg-red-600 rounded-full mb-8"></div>

            <div className="prose prose-slate max-w-none mb-10">
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                {kit.description || "Este kit foi cuidadosamente planejado para trazer magia e sofisticação à sua celebração. Cada item foi selecionado para garantir uma decoração harmoniosa e encantadora."}
              </p>
            </div>

            {kit.items && kit.items.length > 0 && (
              <div className="mb-10 bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100">
                <h3 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tight">O que está incluso:</h3>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {kit.items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium">
                      <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto space-y-4">
              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-green-500 py-6 text-sm font-black uppercase tracking-[0.15em] text-white hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
              >
                <MessageCircle size={22} />
                Solicitar Orçamento / Reservar
              </button>
              <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                Atendimento personalizado via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
