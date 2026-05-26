import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import GalleryUpload from "@/components/GalleryUpload";

export default function InspirationsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<any[]>({
    queryKey: ["admin-inspirations"],
    queryFn: async () => (await api.get("/admin-cms/inspirations")).data,
  });
  
  const [form, setForm] = useState({ title: "", image: "", link: "", gallery: [] as string[] });
  const [editingId, setEditingId] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: async () => (await api.post("/admin-cms/inspirations", { ...form, order: data.length })).data,
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["admin-inspirations"] }); 
      setForm({ title: "", image: "", link: "", gallery: [] }); 
    },
  });

  const update = useMutation({
    mutationFn: async (payload: any) => (await api.put(`/admin-cms/inspirations/${payload.id}`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inspirations"] });
      setEditingId(null);
      setForm({ title: "", image: "", link: "", gallery: [] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin-cms/inspirations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-inspirations"] }),
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      image: item.image,
      link: item.link || "",
      gallery: item.gallery || []
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", image: "", link: "", gallery: [] });
  };

  const handleSubmit = () => {
    if (editingId) {
      update.mutate({ ...form, id: editingId });
    } else {
      create.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inspiração para sua festa</h1>
          <p className="mt-1 text-sm text-slate-500">Galeria de inspirações na Home (Balões, Doces, Topos de bolo, etc).</p>
        </div>
        {editingId && (
          <button onClick={handleCancel} className="flex items-center gap-1 text-sm font-bold text-red-600">
            <X size={16} /> Cancelar Edição
          </button>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Título</label>
              <input 
                placeholder="ex: Balões Personalizados" 
                value={form.title} 
                onChange={e => setForm(s => ({ ...s, title: e.target.value }))} 
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Link (opcional)</label>
              <input 
                placeholder="https://..." 
                value={form.link} 
                onChange={e => setForm(s => ({ ...s, link: e.target.value }))} 
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
              />
            </div>

            <ImageUpload 
              label="Capa (Thumbnail)" 
              value={form.image} 
              onChange={url => setForm(s => ({ ...s, image: url }))} 
              aspectClass="aspect-video" 
              hint="800x450px • formato retangular" 
            />
          </div>

          <div className="space-y-4">
            <GalleryUpload 
              label="Galeria de Fotos"
              value={form.gallery}
              onChange={urls => setForm(s => ({ ...s, gallery: urls }))}
              max={20}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button 
            disabled={!form.title || !form.image || create.isPending || update.isPending} 
            onClick={handleSubmit} 
            className="rounded-lg bg-blue-900 px-8 py-3 text-sm font-bold text-white disabled:opacity-40 flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-lg"
          >
            {editingId ? <Check size={18}/> : <Plus size={18}/>}
            {editingId ? "Salvar Alterações" : "Adicionar Inspiração"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((i: any) => (
          <div key={i.id} className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="aspect-[4/3] bg-slate-100 relative">
              <img src={i.image} alt={i.title} className="h-full w-full object-cover" />
              {i.gallery?.length > 0 && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  {i.gallery.length} fotos
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(i)} 
                  className="p-2.5 bg-white text-blue-900 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => confirm("Excluir esta inspiração?") && remove.mutate(i.id)} 
                  className="p-2.5 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-slate-900 truncate">{i.title}</h3>
              {i.link && <p className="text-[10px] text-slate-500 truncate mt-1">{i.link}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
