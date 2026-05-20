import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { 
  ChevronRight, 
  MessageCircle, 
  Play
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import CategoryGalleryModal from "@/components/CategoryGalleryModal";
import PromotionsAndCourses from "@/components/PromotionsAndCourses";
import NewsVideosSection from "@/components/NewsVideosSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import PegueMonteHome from "@/components/PegueMonteHome";


export default function Home() {
  const branding = useBranding();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  return (
    <div className="bg-slate-50">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Promotions & Courses Block */}
      <PromotionsAndCourses />

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-[10px] font-black uppercase tracking-widest mb-4">
              Nossa Vitrine
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 leading-tight">Explore nosso <br /><span className="text-red-600">Mundo de Doces</span></h2>
            <p className="mt-4 text-lg text-slate-500 font-medium">As melhores marcas e produtos para tornar seus momentos ainda mais especiais.</p>
          </div>
          <Link to="/categorias" className="group text-red-600 font-bold flex items-center gap-2 hover:gap-3 transition-all uppercase text-sm tracking-wider bg-red-50 px-6 py-3 rounded-full">
            Ver todas <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>


        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length > 0 ? categories.map((cat: any) => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat)}
              className="group text-left relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >

              <div className="h-48 overflow-hidden bg-blue-50">
                {cat.coverImage && (
                  <img 
                    src={cat.coverImage} 
                    alt={cat.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-blue-900 group-hover:text-red-600 transition-colors">{cat.name}</h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{cat.description}</p>
              </div>
            </button>
          )) : (
            [
              "Doces", "Chocolates", "Balas", "Confeitaria",
              "Embalagens", "Balões", "Artigos de Festa", "Personalizados"
            ].map((name, i) => (
              <div key={i} className="group rounded-3xl bg-white shadow-md border-2 border-transparent hover:border-red-600 hover:shadow-2xl transition-all overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center">
                  <span className="text-5xl font-black text-blue-900/20">{name.charAt(0)}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-blue-900 group-hover:text-red-600 transition-colors">{name}</h3>
                  <p className="mt-2 text-sm text-slate-500">Variedade completa para você.</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Partners Carousel */}
      <PartnersCarousel />

      {/* Pegue e Monte Home Section */}
      <PegueMonteHome />


      {/* Videos Section */}
      <NewsVideosSection />

      {/* CTA Strip */}
      <section className="py-12 text-white" style={{ backgroundColor: branding?.primaryColor || '#dc2626' }}>
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl md:text-3xl font-black">Vai ter festa? Vem pra {branding?.siteName || "Basmar"}!</h3>
            <p className="mt-2 font-medium opacity-90">Atendimento personalizado por WhatsApp em todas as lojas.</p>
          </div>
          <button 
            onClick={() => window.open(`https://wa.me/${branding?.whatsappPhone?.replace(/\D/g, '') || '5511999999999'}`, '_blank')}
            className="rounded-full bg-white px-8 py-4 font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto"
            style={{ color: branding?.primaryColor || '#dc2626' }}
          >
            <MessageCircle size={20} />
            Chamar no WhatsApp
          </button>
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
