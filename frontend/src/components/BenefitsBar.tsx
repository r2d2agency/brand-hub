import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import * as Icons from "lucide-react";

function BenefitIcon({ name, size = 22 }: { name: string; size?: number }) {
  const key = name.charAt(0).toUpperCase() + name.slice(1);
  const Cmp = (Icons as any)[key] || (Icons as any)[name] || Icons.Check;
  return <Cmp size={size} />;
}

export default function BenefitsBar() {
  const { data: items = [] } = useQuery({
    queryKey: ["site-benefits"],
    queryFn: async () => (await api.get("/site/benefits")).data,
  });

  if (!items.length) return null;

  return (
    <section className="bg-white border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.map((b: any) => (
            <div key={b.id} className="flex items-center gap-3">
              <div className="text-red-600 shrink-0"><BenefitIcon name={b.icon} /></div>
              <div className="min-w-0">
                <div className="text-sm font-black text-blue-900 leading-tight">{b.title}</div>
                {b.subtitle && <div className="text-[11px] text-slate-500 truncate">{b.subtitle}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
