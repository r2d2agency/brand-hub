import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation as SwiperNavigation } from "swiper/modules";
import { 
  Tag, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Calendar,
  User,
  MapPin,
  X
} from "lucide-react";


import "swiper/css";
import "swiper/css/navigation";

export default function PromotionsAndCourses() {
  const branding = useBranding();
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const promoSwiperRef = useRef<any>(null);
  const courseSwiperRef = useRef<any>(null);

  const { data: promotions = [] } = useQuery({
    queryKey: ["site-promotions"],
    queryFn: async () => (await api.get("/site/promotions")).data,
  });


  const handlePromoWhatsApp = (promo: any) => {
    const msg = encodeURIComponent(promo.whatsappMsg || `Olá! Tenho interesse na oferta: ${promo.title}`);
    window.open(`https://wa.me/${branding?.whatsappPhone?.replace(/\D/g, '') || '5511999999999'}?text=${msg}`, "_blank");
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-20">
      <div className="space-y-8">
        
        {/* PROMOTIONS SIDE */}
        <div className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-xs mb-2">
                <Tag size={14} className="fill-red-600" /> Ofertas Imperdíveis
              </div>
              <h2 className="text-3xl font-black text-blue-900">Economize agora</h2>
            </div>
            {promotions.length > 2 && (
              <div className="flex gap-2">
                <button 
                  onClick={() => promoSwiperRef.current?.slidePrev()}
                  className="p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => promoSwiperRef.current?.slideNext()}
                  className="p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            {promotions.length > 0 ? (
              <Swiper
                onSwiper={(swiper) => promoSwiperRef.current = swiper}
                modules={[Autoplay]}
                spaceBetween={12}
                slidesPerView={2}
                observer={false}
                observeParents={false}
                breakpoints={{
                  480: { slidesPerView: 2 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 }
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="rounded-3xl"
              >
              {promotions.map((promo: any) => (
                <SwiperSlide key={promo.id}>
                  <button 
                    onClick={() => setSelectedPromo(promo)}
                    className="w-full text-left bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                  >
                    <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden bg-slate-50">
                      <img 
                        src={promo.image} 
                        alt={promo.title} 
                        className="h-full w-full object-cover" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          Oferta
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-blue-900 line-clamp-1 mb-2">
                        {promo.title}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-red-600">R$ {promo.price}</span>
                        {promo.oldPrice && (
                          <span className="text-sm text-slate-400 line-through">R$ {promo.oldPrice}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
              </Swiper>
            ) : (
              <div className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                Carregando ofertas...
              </div>
            )}
          </div>
        </div>

        {/* COURSES SIDE REMOVED (now in FeaturedServices) */}
      </div>

      {/* PROMO MODAL */}
      {selectedPromo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedPromo(null)}
            className="absolute inset-0 bg-blue-950/80 backdrop-blur-md"
          />
          
          <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedPromo(null)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-red-600 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="md:w-1/2 aspect-square md:aspect-auto relative bg-slate-50">
              <img src={selectedPromo.image} alt={selectedPromo.title} className="h-full w-full object-cover" />
              <div className="absolute top-8 left-8">
                <span className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                  Oferta Ativa
                </span>
              </div>
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col">
              <div className="mb-8">
                <h3 className="text-3xl font-black text-blue-900 mb-4 leading-tight">{selectedPromo.title}</h3>
                <div className="h-1.5 w-16 bg-red-600 rounded-full" />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-black text-red-600 tracking-tighter">
                  R$ <span className="text-6xl">{selectedPromo.price}</span>
                </div>
                {selectedPromo.oldPrice && (
                  <div className="text-slate-400 line-through font-bold text-xl decoration-2 decoration-red-600/30">
                    R$ {selectedPromo.oldPrice}
                  </div>
                )}
              </div>

              <div className="flex-1 prose prose-slate max-w-none">
                <p className="text-slate-600 font-medium leading-relaxed">
                  {selectedPromo.description || "Aproveite esta oferta exclusiva na Basmar! Qualidade e preço baixo para sua festa."}
                </p>
              </div>

              <div className="mt-12">
                <button 
                  onClick={() => handlePromoWhatsApp(selectedPromo)}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-green-500 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
                >
                  <MessageCircle size={22} />
                  Aproveitar Oferta no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


