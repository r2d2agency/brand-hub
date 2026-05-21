import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import * as Icons from "lucide-react";

function CatIcon({ name, size = 32 }: { name?: string | null; size?: number }) {
  if (!name) return <Tag size={size} />;
  if (/\p{Extended_Pictographic}/u.test(name)) return <span style={{ fontSize: size }}>{name}</span>;
  const key = name.charAt(0).toUpperCase() + name.slice(1);
  const Cmp = (Icons as any)[key] || (Icons as any)[name] || Tag;
  return <Cmp size={size} />;
}

export default function CategoryCarousel({
  categories,
  onSelect,
}: {
  categories: any[];
  onSelect: (cat: any) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [categories]);

  const scrollBy = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (!categories?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
      <div className="relative group">
        {/* Fade edges */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-16 z-[5] bg-gradient-to-r from-slate-50 to-transparent transition-opacity ${
            canPrev ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-16 z-[5] bg-gradient-to-l from-slate-50 to-transparent transition-opacity ${
            canNext ? "opacity-100" : "opacity-0"
          }`}
        />

        <button
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          className={`absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-11 md:w-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 text-blue-900 hover:bg-white hover:scale-105 transition-all ${
            canPrev ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className="group/card snap-start shrink-0 w-[110px] md:w-[140px] flex flex-col items-center text-center bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-100"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center mb-2">
                {cat.coverImage ? (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-red-600">
                    <CatIcon name={cat.icon} size={36} />
                  </div>
                )}
              </div>
              <span className="text-[11px] md:text-xs font-black text-blue-900 leading-tight line-clamp-2">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          className={`absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:h-11 md:w-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 text-blue-900 hover:bg-white hover:scale-105 transition-all ${
            canNext ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
