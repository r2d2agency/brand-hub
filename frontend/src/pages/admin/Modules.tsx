import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Module {
  id: string;
  key: string;
  title: string;
  description: string | null;
  icon: string | null;
  enabled: boolean;
  order: number;
}

export default function ModulesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<Module[]>({
    queryKey: ["modules"],
    queryFn: async () => (await api.get("/modules")).data,
  });
  const [form, setForm] = useState({ key: "", title: "", description: "" });

  const create = useMutation({
    mutationFn: async () => (await api.post("/modules", form)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["modules"] });
      setForm({ key: "", title: "", description: "" });
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/modules/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
  const toggle = useMutation({
    mutationFn: async (m: Module) =>
      (await api.put(`/modules/${m.id}`, { enabled: !m.enabled })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Módulos</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
        className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4"
      >
        <input
          required
          placeholder="chave"
          value={form.key}
          onChange={(e) => setForm((s) => ({ ...s, key: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Adicionar
        </button>
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {data.map((m) => (
          <div
            key={m.id}
            className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-xs text-slate-500">{m.key}</div>
              {m.description && <p className="mt-2 text-sm text-slate-600">{m.description}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => toggle.mutate(m)}
                className={`rounded-full px-3 py-1 text-xs ${
                  m.enabled ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                {m.enabled ? "Ativo" : "Inativo"}
              </button>
              <button
                onClick={() => confirm(`Excluir "${m.title}"?`) && remove.mutate(m.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
