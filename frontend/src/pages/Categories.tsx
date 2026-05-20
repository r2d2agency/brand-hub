import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Grid2X2 } from "lucide-react";
import CategoryGalleryModal from "@/components/CategoryGalleryModal";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Carregando categorias...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-blue-900 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black lg:text-7xl">Nossas Vitrines</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-blue-100 font-medium">
            Explore a variedade completa de produtos e artigos para sua festa em todas as nossas categorias.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat: any) => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat)}
              className="group text-left relative overflow-hidden rounded-[40px] bg-white shadow-xl border border-slate-100 hover:border-red-600 hover:scale-[1.03] transition-all duration-500"
            >
              <div className="h-64 overflow-hidden bg-blue-50 relative">
                {cat.coverImage ? (
                  <img 
                    src={cat.coverImage} 
                    alt={cat.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-blue-900/10">
                    <Grid2X2 size={80} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <span className="bg-white text-blue-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    Ver Galeria
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-blue-900 group-hover:text-red-600 transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="mt-3 text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {cat.description || "Variedade completa para você transformar sua celebração."}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Modal */}
      {selectedCategory && (
        <CategoryGalleryModal 
          category={selectedCategory} 
          onClose={() => setSelectedCategory(null)} 
        />
      )}
    </div>
  );
}
