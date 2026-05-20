import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  Palette, 
  Files, 
  Grid2X2, 
  Users, 
  Image as ImageIcon, 
  Store, 
  Settings,
  History,
  LogOut,
  ExternalLink,
  Tag,
  Video,
  Briefcase,
  PartyPopper,
  GraduationCap
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, role: "ANY" },
    { to: "/admin/banners", label: "Banners", icon: ImageIcon, role: "ADMIN" },
    { to: "/admin/partners", label: "Parceiros", icon: Briefcase, role: "ADMIN" },
    { to: "/admin/pegue-monte", label: "Pegue e Monte", icon: PartyPopper, role: "ADMIN" },
    { to: "/admin/promotions", label: "Promoções", icon: Tag, role: "ADMIN" },
    { to: "/admin/news-videos", label: "Novidades", icon: Video, role: "ADMIN" },
    { to: "/admin/categories", label: "Categorias", icon: Grid2X2, role: "ADMIN" },
    { to: "/admin/stores", label: "Lojas", icon: Store, role: "ADMIN" },
    { to: "/admin/history", label: "História", icon: History, role: "ADMIN" },
    { to: "/admin/branding", label: "Branding", icon: Palette, role: "ADMIN" },
    { to: "/admin/pages", label: "Páginas", icon: Files, role: "ADMIN" },
    { to: "/admin/modules", label: "Módulos", icon: Settings, role: "ADMIN" },
    { to: "/admin/users", label: "Usuários", icon: Users, role: "ADMIN" },
  ];

  const filteredLinks = links.filter(link => 
    link.role === "ANY" || (user?.role === "ADMIN")
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white shadow-xl z-50">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-slate-100 px-6 bg-blue-900">
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              BASMAR <span className="text-red-500">Admin</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {filteredLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                      isActive 
                        ? "bg-red-50 text-red-600 shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
                    }`
                  }
                >
                  <l.icon size={18} />
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-100 p-6 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-sm font-black text-white shadow-lg">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-bold text-slate-900">{user?.name}</div>
                <div className="truncate text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Nível: {user?.role}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ExternalLink size={14} />
                Site
              </Link>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>

            <div className="mt-8 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Design by <span className="text-red-600">TNS R2D2</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 pl-64">
        <div className="p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
