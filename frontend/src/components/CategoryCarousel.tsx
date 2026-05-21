import { useRef, useState } from "react";
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
  const [hover, setHover] = useState(false);

  const scrollBy = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (!categories?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
      <div
        className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          onClick={() => scrollBy(-1)}
          className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-blue-900 hover:bg-blue-900 hover:text-white transition-all ${
            hover ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className="group snap-start shrink-0 w-[110px] md:w-[140px] flex flex-col items-center text-center bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border border-slate-100"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center mb-2">
                {cat.coverImage ? (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
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
          className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-blue-900 hover:bg-blue-900 hover:text-white transition-all ${
            hover ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
