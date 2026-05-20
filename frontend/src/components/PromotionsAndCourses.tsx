import { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";

export default function PromotionsAndCourses() {
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

  const { data: promotions = [] } = useQuery({
    queryKey: ["site-promotions"],
    queryFn: async () => (await api.get("/site/promotions")).data,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["site-courses"],
    queryFn: async () => (await api.get("/site/courses")).data,
  });

  const featuredCourse = courses.find((c: any) => c.active && c.showInHome) || courses[0];

  const handlePromoWhatsApp = (promo: any) => {
    const msg = encodeURIComponent(promo.whatsappMsg || `Olá! Tenho interesse na oferta: ${promo.title}`);
    window.open(`https://wa.me/5511999999999?text=${msg}`, "_blank");
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* PROMOTIONS SIDE (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-xs mb-2">
                <Tag size={14} className="fill-red-600" /> Ofertas Imperdíveis
              </div>
              <h2 className="text-3xl font-black text-blue-900">Economize agora</h2>
            </div>
            {promotions.length > 3 && (
              <div className="flex gap-2">
                <button className="promo-prev p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="promo-next p-2 rounded-full border border-slate-200 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <Swiper
              modules={[Autoplay, SwiperNavigation]}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              navigation={{
                prevEl: ".promo-prev",
                nextEl: ".promo-next"
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="rounded-3xl"
            >
              {promotions.map((promo: any) => (
                <SwiperSlide key={promo.id}>
                  <button 
                    onClick={() => setSelectedPromo(promo)}
                    className="w-full text-left group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="aspect-square relative overflow-hidden bg-slate-50">
                      <img 
                        src={promo.image} 
                        alt={promo.title} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          Oferta
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-blue-900 line-clamp-1 mb-2 group-hover:text-red-600 transition-colors">
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
          </div>
        </div>

        {/* COURSES SIDE (4 columns) */}
        <div className="lg:col-span-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs mb-2">
              <Sparkles size={14} className="fill-blue-600" /> Conhecimento
            </div>
            <h2 className="text-3xl font-black text-blue-900 mb-8">Aprenda conosco</h2>

            {featuredCourse ? (
              <div className="flex-1 relative rounded-3xl bg-blue-900 overflow-hidden group shadow-xl">
                <div className="absolute inset-0">
                  <img 
                    src={featuredCourse.coverImage || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"} 
                    alt={featuredCourse.title} 
                    className="h-full w-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent" />
                </div>
                
                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                  <div className="inline-block self-start rounded-lg bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
                    Próximo Curso
                  </div>
                  <h3 className="text-2xl font-black mb-4 leading-tight">{featuredCourse.title}</h3>
                  
                  <div className="space-y-3 mb-8 text-sm font-medium text-blue-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-red-500" />
                      {featuredCourse.date ? new Date(featuredCourse.date).toLocaleDateString('pt-BR') : "Em breve"}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-red-500" />
                      {featuredCourse.instructor}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" />
                      {featuredCourse.location}
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/5511999999999?text=${encodeURIComponent(featuredCourse.whatsappMsg || `Olá! Tenho interesse no curso: ${featuredCourse.title}`)}`}
                    target="_blank"
                    className="w-full rounded-2xl bg-white py-4 text-center text-sm font-black uppercase tracking-widest text-blue-900 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                  >
                    Quero me inscrever
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Novos cursos em breve</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROMO MODAL */}
      <AnimatePresence>
        {selectedPromo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPromo(null)}
              className="absolute inset-0 bg-blue-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
