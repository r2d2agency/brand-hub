import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { MessageCircle } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import CategoryGalleryModal from "@/components/CategoryGalleryModal";
import CategoryCarousel from "@/components/CategoryCarousel";
import PromoBannerSlider from "@/components/PromoBannerSlider";
import PromotionsAndCourses from "@/components/PromotionsAndCourses";
import NewsVideosSection from "@/components/NewsVideosSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import PegueMonteHome from "@/components/PegueMonteHome";
import InspirationGrid from "@/components/InspirationGrid";
import HomeBannersRow from "@/components/HomeBannersRow";

export default function Home() {
  const branding = useBranding();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  const homeCategories = categories.filter((c: any) => c.showInHome !== false);

  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* 1. Hero */}
      <HeroSlider />

      {/* 2. Categorias em carrossel (1 linha) */}
      <CategoryCarousel categories={homeCategories} onSelect={setSelectedCategory} />

      {/* 3. Banner slider promocional (Pegue e Monte) */}
      <PromoBannerSlider />


      {/* 3. Pegue e Monte (destaque) */}
      <PegueMonteHome />

      {/* 4. Inspiração para sua festa */}
      <InspirationGrid />

      {/* 5. HomeBanners: Cursos promo + Sobre a loja */}
      <HomeBannersRow />

      {/* 6. Promoções e Cursos */}
      <PromotionsAndCourses />

      {/* 7. Parceiros */}
      <PartnersCarousel />

      {/* 8. Vídeos */}
      <NewsVideosSection />

      {/* 9. CTA Strip WhatsApp */}
      <section className="py-12 text-white" style={{ backgroundColor: branding?.primaryColor || '#dc2626' }}>
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl md:text-3xl font-black">Precisa de ajuda para montar sua festa?</h3>
            <p className="mt-2 font-medium opacity-90">Chame a Basmar no WhatsApp e fale com nossa equipe.</p>
          </div>
          <button
            onClick={() => window.open(`https://wa.me/${branding?.whatsappPhone?.replace(/\D/g, '') || '5511999999999'}`, '_blank')}
            className="rounded-full bg-white px-8 py-4 font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto"
            style={{ color: branding?.primaryColor || '#dc2626' }}
          >
            <MessageCircle size={20} />
            Falar agora
          </button>
        </div>
      </section>

      {selectedCategory && (
        <CategoryGalleryModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
