import { useEffect, useRef } from "react";

const PARTNERS = [
  { name: "Partner 1", logo: "https://via.placeholder.com/150x80?text=LOGO+1" },
  { name: "Partner 2", logo: "https://via.placeholder.com/150x80?text=LOGO+2" },
  { name: "Partner 3", logo: "https://via.placeholder.com/150x80?text=LOGO+3" },
  { name: "Partner 4", logo: "https://via.placeholder.com/150x80?text=LOGO+4" },
  { name: "Partner 5", logo: "https://via.placeholder.com/150x80?text=LOGO+5" },
  { name: "Partner 6", logo: "https://via.placeholder.com/150x80?text=LOGO+6" },
  { name: "Partner 7", logo: "https://via.placeholder.com/150x80?text=LOGO+7" },
  { name: "Partner 8", logo: "https://via.placeholder.com/150x80?text=LOGO+8" },
];

export default function PartnersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 bg-white overflow-hidden border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center md:text-left">
        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Nossos Parceiros</h2>
        <div className="h-1 w-20 bg-red-600 mt-2 mx-auto md:mx-0 rounded-full"></div>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-scroll whitespace-nowrap py-4">
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <img
                src={partner.logo}
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
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
