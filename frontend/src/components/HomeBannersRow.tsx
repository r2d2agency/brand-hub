import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChevronRight } from "lucide-react";

export default function HomeBannersRow() {
  const { data: banners = [] } = useQuery({
    queryKey: ["site-home-banners"],
    queryFn: async () => (await api.get("/site/home-banners")).data,
  });

  const list = banners.filter((b: any) => b.key !== 'courses-promo').slice(0, 1);
  if (!list.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-4 md:py-6">
      <div className="grid gap-6 md:grid-cols-1">
        {list.map((b: any) => (
          <article
            key={b.id}
            className="relative overflow-hidden rounded-3xl p-6 md:p-10 min-h-[220px] md:min-h-[280px] flex flex-col justify-center"
            style={{ backgroundColor: b.bgColor || "#1e3a8a", color: b.textColor || "#ffffff" }}
          >
            {b.image && (
              <img
                src={b.image}
                alt=""
                className="absolute right-0 top-0 h-full w-1/4 object-cover opacity-90"
              />
            )}
            <div className="relative max-w-[75%]">
              {b.subtitle && (
                <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
                  {b.subtitle}
                </div>
              )}
              <h3 className="text-xl md:text-2xl font-black leading-tight mb-2">
                {b.title}
              </h3>
              {b.description && (
                <p className="text-sm opacity-90 mb-4 line-clamp-2">{b.description}</p>
              )}
              {b.ctaText && b.ctaLink && (
                <a
                  href={b.ctaLink}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors w-fit"
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
