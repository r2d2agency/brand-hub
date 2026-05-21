import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type Slide = {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "pegue-monte",
    image: "/seed/banner-pegue-monte.jpg",
    eyebrow: "Novidade Basmar",
    title: "Pegue e Monte sua Festa",
    subtitle:
      "Kits prontos com painel, suportes, balões e doces. Tudo o que você precisa para uma festa inesquecível em um só lugar.",
    ctaText: "Conhecer os Kits",
    ctaLink: "/pegue-monte",
  },
];

export default function PromoBannerSlider({ slides = DEFAULT_SLIDES }: { slides?: Slide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(id);
  }, [total]);

  if (!total) return null;
  const slide = slides[index];

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6">
      <div className="relative overflow-hidden rounded-3xl shadow-xl group">
        <div className="relative aspect-[21/9] md:aspect-[21/8] w-full">
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/55 to-transparent" />

          <div className="relative h-full flex items-center">
            <div className="px-6 md:px-14 max-w-2xl text-white">
              {slide.eyebrow && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">
                  <Sparkles size={12} />
                  {slide.eyebrow}
                </div>
              )}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="mt-3 md:mt-4 text-sm md:text-base text-white/90 max-w-xl font-medium">
                  {slide.subtitle}
                </p>
              )}
              <Link
                to={slide.ctaLink}
                className="mt-6 inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all active:scale-95 shadow-lg"
              >
                {slide.ctaText}
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
