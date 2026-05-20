import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  displayOrder: number;
}

export default function PartnersCarousel() {
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ["site-partners"],
    queryFn: async () => (await api.get("/site/partners")).data,
  });

  if (partners.length === 0) return null;

  // Duplicate the list enough times to ensure it covers the screen for the infinite effect
  const displayPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-12 bg-white overflow-hidden border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center md:text-left">
        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Nossos Parceiros</h2>
        <div className="h-1 w-20 bg-red-600 mt-2 mx-auto md:mx-0 rounded-full"></div>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-scroll whitespace-nowrap py-4">
          {displayPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
