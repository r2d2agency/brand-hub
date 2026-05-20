import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Plus, Trash2, Edit2, Grid2X2, MessageCircle, 
  Save, X, ImageIcon, GripVertical, Eye, EyeOff
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  gallery: string[];
  whatsappMsg: string;
  active: boolean;
  showInHome: boolean;
}

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  coverImage: "",
  gallery: [],
  whatsappMsg: "",
  active: true,
  showInHome: true,
};

export default function CategoriesAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await api.get("/admin-cms/categories")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin-cms/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (cat: any) => 
      api.put(`/admin-cms/categories/${cat.id}`, { active: !cat.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  const openNew = () => {
    setSelectedCategory(null);
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const openEdit = (cat: any) => {
    setSelectedCategory(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      coverImage: cat.coverImage || "",
      gallery: cat.gallery || [],
      whatsappMsg: cat.whatsappMsg || "",
      active: cat.active ?? true,
      showInHome: cat.showInHome ?? true,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/admin-cms/categories/${selectedCategory.id}`, form);
      } else {
        const slug = form.slug || form.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
        await api.post("/admin-cms/categories", { ...form, slug });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao salvar categoria.");
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Carregando categorias...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorias & Vitrines</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie as vitrines de produtos e as galerias de fotos.</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Nova Categoria
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat: any) => (
          <div key={cat.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              {cat.coverImage ? (
                <img src={cat.coverImage} alt={cat.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Grid2X2 size={40} />
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white ${cat.active ? 'bg-green-500' : 'bg-slate-400'}`}>
                  {cat.active ? 'Ativa' : 'Inativa'}
                </span>
                {cat.gallery?.length > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                    {cat.gallery.length} Fotos
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-blue-900 leading-tight">{cat.name}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">/{cat.slug}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(cat)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(cat.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">{cat.description || "Sem descrição"}</p>
              
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Home</span>
                  <div className={`h-2.5 w-2.5 rounded-full ${cat.showInHome ? 'bg-red-500' : 'bg-slate-200'}`} />
                </div>
                {cat.whatsappMsg && (
                  <div className="text-green-500" title="Mensagem WhatsApp configurada">
                    <MessageCircle size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-blue-900">
                {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nome da Categoria *</label>
                    <input 
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Ex: Chocolates Finos"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">URL Amigável (Slug)</label>
                    <input 
                      value={form.slug}
                      onChange={e => setForm({...form, slug: e.target.value})}
                      placeholder="chocolates-finos"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none bg-slate-50" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descrição curta</label>
                    <textarea 
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      rows={3}
                      placeholder="Breve resumo do que o cliente encontrará nesta vitrine."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none" 
                    />
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={form.active}
                        onChange={e => setForm({...form, active: e.target.checked})}
                        className="h-5 w-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900">Ativa no site</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={form.showInHome}
                        onChange={e => setForm({...form, showInHome: e.target.checked})}
                        className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-600"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-red-600">Destaque na Home</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <ImageUpload 
                    label="Capa da Categoria (Destaque)"
                    value={form.coverImage}
                    onChange={url => setForm({...form, coverImage: url})}
                    aspectClass="aspect-[4/3]"
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Mensagem do WhatsApp</label>
                    <input 
                      value={form.whatsappMsg}
                      onChange={e => setForm({...form, whatsappMsg: e.target.value})}
                      placeholder="Ex: Gostaria de ver o catálogo de chocolates."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                    <p className="text-[10px] text-slate-400 font-medium italic">Esta mensagem será enviada quando o cliente clicar no botão de WhatsApp desta categoria.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8">
                <MultiImageUpload 
                  label="Galeria de Fotos (Mais itens desta categoria)"
                  value={form.gallery}
                  onChange={urls => setForm({...form, gallery: urls})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 pb-2 border-t border-slate-50 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-900 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  <Save size={18} />
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
