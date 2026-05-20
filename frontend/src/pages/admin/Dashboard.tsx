import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get("/admin-cms/stats")).data,
  });

  const cards = [
    { label: "Módulos Ativos", value: stats?.activeModules ?? 0 },
    { label: "Banners Ativos", value: stats?.activeBanners ?? 0 },
    { label: "Categorias", value: stats?.totalCategories ?? 0 },
    { label: "Lojas", value: stats?.totalStores ?? 0 },
    { label: "Cliques WhatsApp", value: stats?.whatsappClicks ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Visão geral do seu site Basmar.</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{c.label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Ações Rápidas</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="rounded-lg border border-slate-200 p-4 text-left hover:bg-slate-50">
              <div className="text-sm font-medium">Novo Banner</div>
              <div className="text-xs text-slate-500">Trocar sazonalidade</div>
            </button>
            <button className="rounded-lg border border-slate-200 p-4 text-left hover:bg-slate-50">
              <div className="text-sm font-medium">Nova Categoria</div>
              <div className="text-xs text-slate-500">Adicionar vitrine</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
