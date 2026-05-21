import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import * as Icons from "lucide-react";
import { useBranding } from "@/lib/branding";

function CategoryIcon({ name, size = 18 }: { name?: string | null; size?: number }) {
  if (!name) return <Icons.Tag size={size} />;
  // Emoji case
  if (/\p{Extended_Pictographic}/u.test(name)) return <span style={{ fontSize: size }}>{name}</span>;
  // Lucide name (PascalCase)
  const key = name.charAt(0).toUpperCase() + name.slice(1);
  const Cmp = (Icons as any)[key] || (Icons as any)[name] || Icons.Tag;
  return <Cmp size={size} />;
}

export default function CategoryMenuBar() {
  const branding = useBranding();
  const { data: categories = [] } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => (await api.get("/site/categories")).data,
  });

  const items = categories.filter((c: any) => c.active && c.showInMenu !== false);
  if (items.length === 0) return null;

  return (
    <div
      className="w-full text-white"
      style={{ backgroundColor: branding?.primaryColor || "#dc2626" }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {items.map((c: any) => (
            <Link
              key={c.id}
              to="/categorias"
              className="flex items-center gap-2 px-4 py-3 text-[11px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap hover:bg-black/15 transition-colors"
              title={c.name}
            >
              <CategoryIcon name={c.icon} size={16} />
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
