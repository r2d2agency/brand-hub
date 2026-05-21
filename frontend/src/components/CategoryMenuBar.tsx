import { Link, useLocation } from "react-router-dom";
import { useBranding } from "@/lib/branding";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/categorias", label: "Categorias" },
  { to: "/pegue-monte", label: "Pegue e Monte" },
  { to: "/cursos", label: "Cursos" },
  { to: "/lojas", label: "Lojas" },
  { to: "/contato", label: "Contato" },
];

export default function CategoryMenuBar() {
  const branding = useBranding();
  const { pathname } = useLocation();

  return (
    <div
      className="w-full text-white"
      style={{ backgroundColor: branding?.primaryColor || "#dc2626" }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-3 text-[11px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                  active ? "bg-black/20" : "hover:bg-black/15"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
