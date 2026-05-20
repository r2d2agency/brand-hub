import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  ChevronRight, 
  Clock, 
  MapPin, 
  Info,
  Store,
  MessageCircle,
  Navigation
} from "lucide-react";

import { useState, useEffect } from "react";

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
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black lg:text-7xl">Nossa História</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-blue-100">
            {history?.title || "Desde 1991, transformando celebrações em momentos doces e inesquecíveis."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-black uppercase tracking-widest text-red-600 mb-6">
              Quem Somos
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-6 md:mb-8 leading-tight">Tradição e Qualidade em cada detalhe</h2>
            <div className="prose prose-lg text-slate-600 max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-sm md:text-base">
                {history?.content || "Carregando história da Basmar..."}
              </p>
            </div>
          </div>
          <div className="relative order-first lg:order-last mb-8 lg:mb-0">
            <div className="aspect-square rounded-3xl bg-blue-100 overflow-hidden shadow-2xl">
              {history?.mainImage ? (
                <img src={history.mainImage} alt="Basmar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-900/10">
                  <Info size={120} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-red-600 p-6 md:p-8 text-white shadow-xl hidden sm:block">
              <div className="text-3xl md:text-4xl font-black">30+</div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-80">Anos de Doçura</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      {history?.timeline && history.timeline.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-2xl md:text-3xl font-black text-blue-900 mb-12 md:mb-16">Nossa Linha do Tempo</h2>
            <div className="relative border-l-2 border-blue-100 ml-4 md:ml-0 md:border-l-0 md:flex md:justify-between md:gap-8 overflow-x-auto pb-4">
              {history.timeline.map((item: any, idx: number) => (
                <div key={idx} className="mb-10 md:mb-0 relative pl-10 md:pl-0 md:flex-1 md:text-center min-w-[200px]">
                  <div className="absolute -left-2.5 top-0 md:static md:mx-auto md:mb-6 h-5 w-5 rounded-full bg-red-600 border-4 border-white shadow-sm"></div>
                  <div className="text-xl md:text-2xl font-black text-red-600 mb-1">{item.year}</div>
                  <h4 className="font-bold text-blue-900 mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stores */}
      <section id="lojas" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <h2 className="text-center text-3xl md:text-5xl font-black text-blue-900 mb-4">Nossas Unidades</h2>
        <p className="text-center text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
          Encontre a Basmar mais próxima de você e venha transformar sua festa em um momento inesquecível.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {stores.map((store: any) => {
            const hasCoords = store.latitude && store.longitude;
            
            return (
              <div key={store.id} className="group relative rounded-3xl bg-white p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 transition-all hover:scale-[1.02] hover:shadow-2xl">
                {/* Store Photo */}
                <div className="relative h-56 md:h-full w-full md:w-64 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                  {store.images?.[0] ? (
                    <img src={store.images[0]} alt={store.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-blue-900/10">
                      <Store size={80} />
                    </div>
                  )}
                  {!store.active && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <span className="bg-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-slate-900">Em Reforma</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-blue-900 mb-2 leading-tight">{store.name}</h3>
                    <div className="h-1 w-12 bg-red-600 rounded-full"></div>
                  </div>

                  <div className="space-y-4 text-sm text-slate-600 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Endereço</p>
                        <p>{store.address}, {store.neighborhood}</p>
                        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mt-1">{store.city}/{store.state} - {store.zipCode}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-blue-900" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Horário</p>
                        <p>{store.hours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {store.whatsapp && (
                      <a 
                        href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                      >
                        <MessageCircle size={18} />
                        WhatsApp
                      </a>
                    )}
                    
                    {store.mapsLink && (
                      <a 
                        href={store.mapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all"
                      >
                        <Navigation size={18} className="text-blue-900" />
                        Traçar Rota
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
