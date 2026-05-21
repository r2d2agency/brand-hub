import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChevronRight } from "lucide-react";

export default function HomeBannersRow() {
  const { data: banners = [] } = useQuery({
    queryKey: ["site-home-banners"],
    queryFn: async () => (await api.get("/site/home-banners")).data,
  });

  const list = banners.slice(0, 2);
  if (!list.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {list.map((b: any) => (
          <article
            key={b.id}
            className="relative overflow-hidden rounded-3xl p-8 md:p-10 min-h-[260px] flex flex-col justify-center"
            style={{ backgroundColor: b.bgColor || "#1e3a8a", color: b.textColor || "#ffffff" }}
          >
            {b.image && (
              <img
                src={b.image}
                alt=""
                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-90"
              />
            )}
            <div className="relative max-w-[55%]">
              {b.subtitle && (
                <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
                  {b.subtitle}
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-black leading-tight mb-3">
                {b.title}
              </h3>
              {b.description && (
                <p className="text-sm opacity-90 mb-5 line-clamp-3">{b.description}</p>
              )}
              {b.ctaText && b.ctaLink && (
                <a
                  href={b.ctaLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  {b.ctaText} <ChevronRight size={14} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
