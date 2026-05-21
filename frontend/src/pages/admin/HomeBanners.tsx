import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Trash2, Save, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const EMPTY = { key: "", title: "", subtitle: "", description: "", image: "", ctaText: "", ctaLink: "", bgColor: "#1e3a8a", textColor: "#ffffff" };

export default function HomeBannersAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<any[]>({
    queryKey: ["admin-home-banners"],
    queryFn: async () => (await api.get("/admin-cms/home-banners")).data,
  });
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);

  const save = useMutation({
    mutationFn: async () => editing
      ? (await api.put(`/admin-cms/home-banners/${editing.id}`, form)).data
      : (await api.post("/admin-cms/home-banners", { ...form, order: data.length })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-home-banners"] }); setEditing(null); setForm(EMPTY); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin-cms/home-banners/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-home-banners"] }),
  });

  const openEdit = (b: any) => { setEditing(b); setForm({ ...EMPTY, ...b }); };
  const openNew = () => { setEditing({}); setForm(EMPTY); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners Destaque (Home)</h1>
          <p className="mt-1 text-sm text-slate-500">2 banners lado a lado na Home — ex: "Cursos disponíveis" + "Sobre a Loja".</p>
        </div>
        <button onClick={openNew} className="rounded-md bg-blue-900 px-4 py-2 text-sm font-bold text-white flex items-center gap-2"><Plus size={16}/> Novo Banner</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((b: any) => (
          <div key={b.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="h-32 relative" style={{ backgroundColor: b.bgColor }}>
              {b.image && <img src={b.image} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover" />}
              <div className="absolute inset-0 p-4 flex flex-col justify-center" style={{ color: b.textColor }}>
                <div className="text-xs opacity-80">{b.subtitle}</div>
                <div className="font-black">{b.title}</div>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">{b.key}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(b)} className="text-xs font-bold text-blue-900 hover:underline">Editar</button>
                <button onClick={() => confirm("Excluir?") && remove.mutate(b.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-bold text-blue-900">{editing.id ? "Editar" : "Novo"} Banner</h2>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-slate-100 rounded"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <input required placeholder="Chave única (ex: courses-promo)" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input required placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input placeholder="Subtítulo" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <ImageUpload label="Imagem" value={form.image} onChange={url => setForm({ ...form, image: url })} aspectClass="aspect-[2/1]" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Texto do botão" value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
                <input placeholder="Link do botão" value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm">Fundo: <input type="color" value={form.bgColor} onChange={e => setForm({ ...form, bgColor: e.target.value })} className="h-9 w-16" /></label>
                <label className="flex items-center gap-2 text-sm">Texto: <input type="color" value={form.textColor} onChange={e => setForm({ ...form, textColor: e.target.value })} className="h-9 w-16" /></label>
              </div>
              <button onClick={() => save.mutate()} className="w-full rounded-md bg-blue-900 px-4 py-3 text-sm font-bold text-white flex items-center justify-center gap-2"><Save size={16}/> Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
