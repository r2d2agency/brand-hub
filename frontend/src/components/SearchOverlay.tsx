import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, X, Tag, GraduationCap, PartyPopper } from "lucide-react";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  const { data: categories = [] } = useQuery({ queryKey: ["site-categories"], queryFn: async () => (await api.get("/site/categories")).data });
  const { data: courses = [] } = useQuery({ queryKey: ["site-courses"], queryFn: async () => (await api.get("/site/courses")).data });
  const { data: kits = [] } = useQuery({ queryKey: ["site-pegue-monte-home"], queryFn: async () => (await api.get("/site/pegue-monte")).data });

  useEffect(() => {
    if (open) setQ("");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return { cats: [], crs: [], kt: [] };
    const match = (s: string | null | undefined) => (s || "").toLowerCase().includes(term);
    return {
      cats: categories.filter((c: any) => match(c.name) || match(c.description)).slice(0, 6),
      crs: courses.filter((c: any) => match(c.title) || match(c.description)).slice(0, 6),
      kt: kits.filter((k: any) => match(k.name) || match(k.theme) || match(k.description)).slice(0, 6),
    };
  }, [term, categories, courses, kits]);

  if (!open) return null;
  const total = results.cats.length + results.crs.length + results.kt.length;

  return (
    <div className="fixed inset-0 z-[200] bg-blue-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-20">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <Search className="text-red-600" size={22} />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar categorias, cursos, kits..."
            className="flex-1 text-lg outline-none placeholder:text-slate-300 font-medium"
          />
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><X size={20} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!term && (
            <div className="p-10 text-center text-slate-400 font-medium text-sm">
              Digite para buscar produtos, cursos e kits.
            </div>
          )}
          {term && total === 0 && (
            <div className="p-10 text-center text-slate-400 font-medium text-sm">
              Nenhum resultado para <span className="text-blue-900 font-bold">"{q}"</span>
            </div>
          )}
          {results.cats.length > 0 && (
            <Section title="Categorias" icon={<Tag size={14} />}>
              {results.cats.map((c: any) => (
                <ResultRow key={c.id} onClick={onClose} to="/categorias" image={c.coverImage} title={c.name} subtitle={c.description} />
              ))}
            </Section>
          )}
          {results.crs.length > 0 && (
            <Section title="Cursos" icon={<GraduationCap size={14} />}>
              {results.crs.map((c: any) => (
                <ResultRow key={c.id} onClick={onClose} to="/cursos" image={c.coverImage} title={c.title} subtitle={c.instructor || c.location} />
              ))}
            </Section>
          )}
          {results.kt.length > 0 && (
            <Section title="Pegue e Monte" icon={<PartyPopper size={14} />}>
              {results.kt.map((k: any) => (
                <ResultRow key={k.id} onClick={onClose} to={`/pegue-monte/${k.slug || k.id}`} image={k.coverImage} title={k.name} subtitle={k.theme || k.description} />
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="border-b border-slate-50 last:border-0">
      <div className="px-5 py-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 bg-slate-50">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function ResultRow({ to, onClick, image, title, subtitle }: any) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
      <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
        {image && <img src={image} alt={title} className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-blue-900 truncate">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 truncate">{subtitle}</div>}
      </div>
    </Link>
  );
}
