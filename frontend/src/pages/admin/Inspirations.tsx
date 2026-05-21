import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function InspirationsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<any[]>({
    queryKey: ["admin-inspirations"],
    queryFn: async () => (await api.get("/admin-cms/inspirations")).data,
  });
  const [form, setForm] = useState({ title: "", image: "", link: "" });

  const create = useMutation({
    mutationFn: async () => (await api.post("/admin-cms/inspirations", { ...form, order: data.length })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-inspirations"] }); setForm({ title: "", image: "", link: "" }); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin-cms/inspirations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inspirations"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inspiração para sua festa</h1>
        <p className="mt-1 text-sm text-slate-500">Galeria de inspirações na Home (Balões, Doces, Topos de bolo, etc).</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <input placeholder="Título (ex: Balões)" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Link (opcional)" value={form.link} onChange={e => setForm(s => ({ ...s, link: e.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <ImageUpload label="Imagem" value={form.image} onChange={url => setForm(s => ({ ...s, image: url }))} aspectClass="aspect-square" />
        <button disabled={!form.title || !form.image} onClick={() => create.mutate()} className="rounded-md bg-blue-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-40 flex items-center gap-2"><Plus size={16}/> Adicionar</button>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {data.map((i: any) => (
          <div key={i.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-square bg-slate-100"><img src={i.image} alt={i.title} className="h-full w-full object-cover" /></div>
            <div className="p-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-900 truncate">{i.title}</span>
              <button onClick={() => confirm("Excluir?") && remove.mutate(i.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
