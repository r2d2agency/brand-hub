import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/branding", label: "Branding" },
  { to: "/admin/pages", label: "Páginas" },
  { to: "/admin/modules", label: "Módulos" },
  { to: "/admin/users", label: "Usuários" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-60 border-r border-slate-200 bg-white p-4">
        <Link to="/" className="block px-2 pb-4 text-sm font-semibold">
          ← Ver site
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <div className="font-medium text-slate-700">{user?.name}</div>
          <div>{user?.email}</div>
          <button
            onClick={logout}
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
