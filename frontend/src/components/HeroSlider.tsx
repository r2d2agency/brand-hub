import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroSlider() {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["site-banners"],
    queryFn: async () => (await api.get("/site/banners")).data,
  });

  if (isLoading) {
    return (
      <div className="h-[300px] md:h-[500px] lg:h-[650px] w-full bg-blue-900 animate-pulse flex items-center justify-center">
        <div className="text-blue-200 font-bold uppercase tracking-widest text-xs">Carregando ofertas...</div>
      </div>
    );
  }

  // Fallback se não houver banners
  if (banners.length === 0) {
    return (
      <section className="relative h-[300px] md:h-[500px] lg:h-[650px] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-black leading-tight lg:text-7xl">
              Tudo para sua festa ser <span className="text-red-500 italic">inesquecível!</span>
            </h1>
            <p className="mt-6 text-lg font-medium text-blue-100">
              Desde 1991, transformando celebrações em momentos doces e especiais.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const firstBanner = banners[0];
  const effect = firstBanner?.transitionType === "slide" ? "slide" : "fade";
  const delay = (firstBanner?.transitionTime || 5) * 1000;

  return (
    <section className="relative h-[300px] md:h-[500px] lg:h-[700px] w-full bg-slate-900 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect={effect}
        pagination={{ clickable: true }}
        autoplay={{ delay: delay, disableOnInteraction: false }}
        loop={banners.length > 1}
        className="h-full w-full hero-swiper"
      >
        {banners.map((banner: any, index: number) => (
          <SwiperSlide key={banner.id}>
            {({ isActive }: { isActive: boolean }) => (
              <div className="relative h-full w-full flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <picture>
                    <source media="(max-width: 768px)" srcSet={banner.imageMobile || banner.imageDesktop} />
                    <img 
                      src={banner.imageDesktop} 
                      alt={banner.title} 
                      className="h-full w-full object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative mx-auto max-w-7xl px-6 w-full">
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <div className="max-w-3xl">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white mb-6"
                        >
                          Basmar Doces & Festas
                        </motion.div>
                        
                        <motion.h2
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className={`font-black leading-tight text-white mb-6 ${banner.fontSize || "text-4xl md:text-6xl lg:text-8xl"}`}
                          style={{ fontFamily: banner.fontFamily || "Inter" }}
                        >
                          {banner.title.split(' ').map((word: string, i: number) => (
                            <span key={i} className={i % 3 === 2 ? "text-red-500" : ""}>
                              {word}{' '}
                            </span>
                          ))}
                        </motion.h2>

                        {banner.subtitle && (
                          <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-lg md:text-xl font-medium text-blue-100 mb-10 max-w-xl"
                          >
                            {banner.subtitle}
                          </motion.p>
                        )}

                        {banner.buttonText && (
                          <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                          >
                            <a 
                              href={banner.buttonLink || "#"}
                              className="rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-red-900/40 hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2"
                            >
                              {banner.buttonText}
                              <ChevronRight size={20} />
                            </a>
                            <button className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-lg font-bold text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                              Falar no WhatsApp
                              <MessageCircle size={20} />
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Swiper Pagination */}
      <style>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #fff;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 6px;
          background: #ef4444;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
