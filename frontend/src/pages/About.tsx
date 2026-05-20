import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  ChevronRight, 
  Clock, 
  MapPin, 
  Info,
  Calendar,
  Users
} from "lucide-react";

export default function About() {
  const { data: history } = useQuery({
    queryKey: ["site-history"],
    queryFn: async () => (await api.get("/site/history")).data,
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["site-stores"],
    queryFn: async () => (await api.get("/site/stores")).data,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-blue-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-5xl font-black lg:text-7xl">Nossa História</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            {history?.title || "Desde 1991, transformando celebrações em momentos doces e inesquecíveis."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-600 mb-6">
              Quem Somos
            </div>
            <h2 className="text-4xl font-black text-blue-900 mb-8">Tradição e Qualidade em cada detalhe</h2>
            <div className="prose prose-lg text-slate-600 max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {history?.content || "Carregando história da Basmar..."}
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-blue-100 overflow-hidden shadow-2xl">
              {history?.mainImage ? (
                <img src={history.mainImage} alt="Basmar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-900/10">
                  <Info size={120} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-red-600 p-8 text-white shadow-xl hidden md:block">
              <div className="text-4xl font-black">30+</div>
              <div className="text-sm font-bold uppercase tracking-wider opacity-80">Anos de Doçura</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      {history?.timeline && history.timeline.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-black text-blue-900 mb-16">Nossa Linha do Tempo</h2>
            <div className="relative border-l-2 border-blue-100 ml-4 md:ml-0 md:border-l-0 md:flex md:justify-between md:gap-8">
              {history.timeline.map((item: any, idx: number) => (
                <div key={idx} className="mb-12 md:mb-0 relative pl-10 md:pl-0 md:flex-1 md:text-center">
                  <div className="absolute -left-2.5 top-0 md:static md:mx-auto md:mb-6 h-5 w-5 rounded-full bg-red-600 border-4 border-white shadow-sm"></div>
                  <div className="text-2xl font-black text-red-600 mb-1">{item.year}</div>
                  <h4 className="font-bold text-blue-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stores */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-black text-blue-900 mb-12">Nossas Unidades</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {stores.map((store: any) => (
            <div key={store.id} className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
              <div className="h-40 w-full md:w-40 rounded-2xl bg-blue-50 shrink-0 flex items-center justify-center text-blue-900/20">
                <MapPin size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black text-blue-900 mb-4">{store.name}</h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="flex items-start gap-3">
                    <MapPin size={18} className="text-red-600 shrink-0" />
                    {store.address}, {store.neighborhood}
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock size={18} className="text-red-600 shrink-0" />
                    {store.hours}
                  </p>
                </div>
                <a 
                  href={store.mapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
                >
                  Ver no Google Maps <ChevronRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
