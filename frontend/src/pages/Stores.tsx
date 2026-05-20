import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { 
  MapPin, 
  Store,
  MessageCircle,
  Navigation,
  Clock
} from "lucide-react";

import { useState, useEffect } from "react";

export default function Stores() {
  const branding = useBranding();
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
          <h1 className="text-4xl md:text-5xl font-black lg:text-7xl">Nossas Unidades</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-blue-100">
            Encontre a Basmar mais próxima de você e venha transformar sua festa em um momento inesquecível.
          </p>
        </div>
      </section>

      {/* Stores */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          {stores.map((store: any) => {
            const hasCoords = store.latitude && store.longitude;
            
            const distance = (hasCoords && userLocation) 
              ? calculateDistance(userLocation.lat, userLocation.lon, store.latitude, store.longitude)
              : null;
            
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
                  {distance && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-900 shadow-sm border border-blue-50 flex items-center gap-1.5 animate-bounce-subtle">
                      <Navigation size={10} className="fill-blue-900" />
                      {distance} km de você
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
