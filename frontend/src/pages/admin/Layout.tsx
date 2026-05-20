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
  HelpCircle,
  MessageSquare,
  LogOut,
  ExternalLink
} from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/banners", label: "Banners", icon: ImageIcon },
  { to: "/admin/categories", label: "Categorias", icon: Grid2X2 },
  { to: "/admin/stores", label: "Lojas", icon: Store },
  { to: "/admin/history", label: "História", icon: History },
  { to: "/admin/branding", label: "Branding", icon: Palette },
  { to: "/admin/pages", label: "Páginas", icon: Files },
  { to: "/admin/modules", label: "Módulos", icon: Settings },
  { to: "/admin/users", label: "Usuários", icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-slate-100 px-6 bg-blue-900">
            <span className="text-lg font-black text-white">BASMAR <span className="text-red-400">Admin</span></span>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-pink-50 text-pink-600" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <l.icon size={18} />
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium text-slate-900">{user?.name}</div>
                <div className="truncate text-xs text-slate-500">{user?.email}</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <ExternalLink size={14} />
                Site
              </Link>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-100"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 pl-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
