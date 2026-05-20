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

  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

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

    </div>
  );
}
