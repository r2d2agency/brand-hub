import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart3, Users, Eye, TrendingUp, Globe, Clock } from "lucide-react";

type Preset = "today" | "7d" | "30d" | "90d" | "custom";

const presets: { key: Preset; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "90d", label: "90 dias" },
  { key: "custom", label: "Personalizado" },
];

function getRange(preset: Preset, customFrom: string, customTo: string) {
  const now = new Date();
  if (preset === "today") return { from: startOfDay(now), to: endOfDay(now) };
  if (preset === "7d") return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
  if (preset === "30d") return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
  if (preset === "90d") return { from: startOfDay(subDays(now, 89)), to: endOfDay(now) };
  return {
    from: customFrom ? startOfDay(new Date(customFrom)) : startOfDay(subDays(now, 6)),
    to: customTo ? endOfDay(new Date(customTo)) : endOfDay(now),
  };
}

export default function Analytics() {
  const [preset, setPreset] = useState<Preset>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const range = useMemo(() => getRange(preset, customFrom, customTo), [preset, customFrom, customTo]);

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", range.from.toISOString(), range.to.toISOString()],
    queryFn: async () =>
      (await api.get("/admin-cms/analytics", {
        params: { from: range.from.toISOString(), to: range.to.toISOString() },
      })).data,
  });

  const totals = data?.totals ?? { views: 0, visitors: 0 };
  const daily = (data?.daily ?? []).map((d: any) => ({
    ...d,
    label: format(new Date(d.day), "dd/MM", { locale: ptBR }),
  }));
  const byPath = data?.byPath ?? [];
  const topReferrers = data?.topReferrers ?? [];
  const recent = data?.recent ?? [];

  const avgPerVisitor = totals.visitors > 0 ? (totals.views / totals.visitors).toFixed(1) : "0";

  const cards = [
    { label: "Visualizações", value: totals.views.toLocaleString("pt-BR"), icon: Eye, color: "text-blue-900", bg: "bg-blue-50" },
    { label: "Visitantes Únicos", value: totals.visitors.toLocaleString("pt-BR"), icon: Users, color: "text-red-600", bg: "bg-red-50" },
    { label: "Páginas / Visitante", value: avgPerVisitor, icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Páginas Distintas", value: byPath.length.toLocaleString("pt-BR"), icon: Globe, color: "text-purple-700", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-red-600" /> Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Visitantes, cliques e páginas mais acessadas do site.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center gap-2">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              preset === p.key
                ? "bg-red-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p.label}
          </button>
        ))}
        {preset === "custom" && (
          <div className="flex items-center gap-2 ml-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            />
            <span className="text-slate-400">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
            />
          </div>
        )}
        <div className="ml-auto text-xs text-slate-500">
          {format(range.from, "dd/MM/yyyy", { locale: ptBR })} – {format(range.to, "dd/MM/yyyy", { locale: ptBR })}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.label}</div>
              <div className={`h-9 w-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon size={18} className={c.color} />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900">
              {isLoading ? "…" : c.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Tráfego Diário</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" name="Visualizações" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="visitors" name="Visitantes" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Páginas Mais Acessadas</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPath.slice(0, 10)} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="path" tick={{ fontSize: 11 }} width={140} />
                <Tooltip />
                <Bar dataKey="views" name="Views" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-2">Página</th>
                  <th className="py-2 text-right">Views</th>
                  <th className="py-2 text-right">Únicos</th>
                </tr>
              </thead>
              <tbody>
                {byPath.map((p: any) => (
                  <tr key={p.path} className="border-b border-slate-50">
                    <td className="py-2 font-mono text-xs text-slate-700 truncate max-w-xs">{p.path}</td>
                    <td className="py-2 text-right font-bold">{p.views}</td>
                    <td className="py-2 text-right text-slate-500">{p.visitors}</td>
                  </tr>
                ))}
                {byPath.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-slate-400">Sem dados no período</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrers + recent */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Principais Origens</h2>
            <div className="space-y-2">
              {topReferrers.map((r: any) => (
                <div key={r.referrer} className="flex items-center justify-between text-sm">
                  <span className="truncate text-slate-700 max-w-[70%]">{r.referrer}</span>
                  <span className="font-bold text-slate-900">{r.views}</span>
                </div>
              ))}
              {topReferrers.length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4">Sem dados</div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={18} /> Visitas Recentes
            </h2>
            <div className="max-h-72 overflow-y-auto space-y-1">
              {recent.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 py-1.5">
                  <span className="font-mono text-slate-700 truncate max-w-[60%]">{r.path}</span>
                  <span className="text-slate-400">{format(new Date(r.createdAt), "dd/MM HH:mm", { locale: ptBR })}</span>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4">Sem visitas no período</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
