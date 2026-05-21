import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function InspirationGrid() {
  const { data: items = [] } = useQuery({
    queryKey: ["site-inspirations"],
    queryFn: async () => (await api.get("/site/inspirations")).data,
  });

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-blue-900">
          Inspiração para <span className="text-red-600">sua festa</span>
        </h2>
        <Link to="/categorias" className="text-red-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Ver mais inspirações <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item: any) => (
          <a
            key={item.id}
            href={item.link || "#"}
            className="group block"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="mt-2 text-center text-xs md:text-sm font-bold text-blue-900 leading-tight">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
