import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";

interface Page {
  id: string;
  slug: string;
  title: string;
}
interface Module {
  id: string;
  key: string;
  title: string;
  description: string | null;
  enabled: boolean;
}

export default function Home() {
  const branding = useBranding();
  const { data: pages = [] } = useQuery<Page[]>({
    queryKey: ["pages"],
    queryFn: async () => (await api.get("/pages")).data,
  });
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ["modules"],
    queryFn: async () => (await api.get("/modules")).data,
  });

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            {branding?.logoUrl && <img src={branding.logoUrl} alt="" className="h-8 w-8" />}
            <span className="text-lg font-semibold">{branding?.siteName ?? "Site"}</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            {pages.map((p) => (
              <Link key={p.id} to={`/p/${p.slug}`} className="hover:opacity-70">
                {p.title}
              </Link>
            ))}
            <Link to="/admin" className="text-slate-500 hover:opacity-70">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">{branding?.siteName}</h1>
        {branding?.tagline && (
          <p className="mt-4 text-lg text-slate-600">{branding.tagline}</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {modules
            .filter((m) => m.enabled)
            .map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-slate-200 p-6 transition hover:shadow-md"
              >
                <h3 className="font-semibold">{m.title}</h3>
                {m.description && (
                  <p className="mt-2 text-sm text-slate-600">{m.description}</p>
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
