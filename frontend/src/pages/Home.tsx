import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { ChevronRight, MessageCircle, Tag } from "lucide-react";
import * as Icons from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import CategoryGalleryModal from "@/components/CategoryGalleryModal";
import PromotionsAndCourses from "@/components/PromotionsAndCourses";
import NewsVideosSection from "@/components/NewsVideosSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import PegueMonteHome from "@/components/PegueMonteHome";
import InspirationGrid from "@/components/InspirationGrid";
import HomeBannersRow from "@/components/HomeBannersRow";

function CatIcon({ name, size = 32 }: { name?: string | null; size?: number }) {
  if (!name) return <Tag size={size} />;
  if (/\p{Extended_Pictographic}/u.test(name)) return <span style={{ fontSize: size }}>{name}</span>;
  const key = name.charAt(0).toUpperCase() + name.slice(1);
  const Cmp = (Icons as any)[key] || (Icons as any)[name] || Tag;
  return <Cmp size={size} />;
}

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

      {/* 2. Categories Grid (cards rápidos com ícone) */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
          {homeCategories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="group flex flex-col items-center text-center bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-100"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center mb-2">
                {cat.coverImage ? (
                  <img src={cat.coverImage} alt={cat.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-red-600"><CatIcon name={cat.icon} size={36} /></div>
                )}
              </div>
              <span className="text-[11px] md:text-xs font-black text-blue-900 leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

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
