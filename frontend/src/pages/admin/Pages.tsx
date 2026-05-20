import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Page {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  order: number;
}

export default function PagesAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<Page[]>({
    queryKey: ["pages"],
    queryFn: async () => (await api.get("/pages")).data,
  });
  const [form, setForm] = useState({ slug: "", title: "" });

  const create = useMutation({
    mutationFn: async () =>
      (await api.post("/pages", { ...form, content: { blocks: [] } })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pages"] });
      setForm({ slug: "", title: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/pages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pages"] }),
  });

  const togglePublish = useMutation({
    mutationFn: async (p: Page) =>
      (await api.put(`/pages/${p.id}`, { published: !p.published })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pages"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Páginas</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
        className="mt-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <input
          required
          placeholder="slug"
          value={form.slug}
          onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Adicionar
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2 text-slate-500">/{p.slug}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => togglePublish.mutate(p)}
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.published ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.published ? "Publicada" : "Rascunho"}
                  </button>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => confirm(`Excluir "${p.title}"?`) && remove.mutate(p.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Nenhuma página
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
