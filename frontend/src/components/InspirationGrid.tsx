import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChevronRight, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import InspirationGalleryModal from "./InspirationGalleryModal";

export default function InspirationGrid() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: items = [] } = useQuery({
    queryKey: ["site-inspirations"],
    queryFn: async () => (await api.get("/site/inspirations")).data,
  });

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-6 md:py-8">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-blue-900">
          Inspiração para <span className="text-red-600">sua festa</span>
        </h2>
        <Link to="/categorias" className="text-red-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Ver mais inspirações <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group block text-left"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all relative">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100">
                <Maximize2 size={16} className="text-blue-900" />
              </div>
              {item.gallery?.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-900/80 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  +{item.gallery.length} FOTOS
                </div>
              )}
            </div>
            <p className="mt-3 text-center text-xs md:text-sm font-black text-blue-900 leading-tight group-hover:text-red-600 transition-colors">
              {item.title}
            </p>
          </button>
        ))}
      </div>

      {selectedItem && (
        <InspirationGalleryModal 
          inspiration={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </section>
  );
}
