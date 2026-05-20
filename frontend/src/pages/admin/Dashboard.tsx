import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Dashboard() {
  const { data: pages = [] } = useQuery<unknown[]>({
    queryKey: ["pages"],
    queryFn: async () => (await api.get("/pages")).data,
  });
  const { data: modules = [] } = useQuery<unknown[]>({
    queryKey: ["modules"],
    queryFn: async () => (await api.get("/modules")).data,
  });
  const { data: users = [] } = useQuery<unknown[]>({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/users")).data,
  });

  const cards = [
    { label: "Páginas", value: pages.length },
    { label: "Módulos", value: modules.length },
    { label: "Usuários", value: users.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Visão geral do conteúdo do site.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">{c.label}</div>
            <div className="mt-2 text-3xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
