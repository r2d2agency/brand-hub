import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Plus, Trash2, Edit2, Tag, MessageCircle, 
  Save, X, ImageIcon, DollarSign
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface PromotionForm {
  title: string;
  image: string;
  price: string;
  oldPrice: string;
  description: string;
  whatsappMsg: string;
  active: boolean;
  order: number;
}

const EMPTY_FORM: PromotionForm = {
  title: "",
  image: "",
  price: "",
  oldPrice: "",
  description: "",
  whatsappMsg: "",
  active: true,
  order: 0,
};

export default function PromotionsAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [form, setForm] = useState<PromotionForm>(EMPTY_FORM);

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => (await api.get("/admin-cms/promotions")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin-cms/promotions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-promotions"] }),
  });

  const openNew = () => {
    setSelectedPromotion(null);
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const openEdit = (promo: any) => {
    setSelectedPromotion(promo);
    setForm({
      title: promo.title || "",
      image: promo.image || "",
      price: promo.price || "",
      oldPrice: promo.oldPrice || "",
      description: promo.description || "",
      whatsappMsg: promo.whatsappMsg || "",
      active: promo.active ?? true,
      order: promo.order || 0,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPromotion) {
        await api.put(`/admin-cms/promotions/${selectedPromotion.id}`, form);
      } else {
        await api.post("/admin-cms/promotions", form);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-promotions"] });
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao salvar promoção.");
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Carregando promoções...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promoções</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie os produtos em oferta no carrossel da home.</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          Nova Promoção
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {promotions.map((promo: any) => (
          <div key={promo.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="aspect-square w-full overflow-hidden bg-slate-100">
              {promo.image ? (
                <img src={promo.image} alt={promo.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Tag size={40} />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-slate-900 line-clamp-1">{promo.title}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-black text-red-600">R$ {promo.price}</span>
                {promo.oldPrice && (
                  <span className="text-xs text-slate-400 line-through">R$ {promo.oldPrice}</span>
                )}
              </div>
              
              <div className="mt-4 flex justify-end gap-1">
                <button onClick={() => openEdit(promo)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => { if(confirm("Excluir?")) deleteMutation.mutate(promo.id) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-blue-900">
                {selectedPromotion ? "Editar Promoção" : "Nova Oferta"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <ImageUpload 
                label="Foto do Produto *"
                value={form.image}
                onChange={url => setForm({...form, image: url})}
                aspectClass="aspect-square"
                hint="800x800px • quadrado • fundo branco/neutro"
              />


              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Título do Produto *</label>
                <input 
                  required
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Preço Oferta</label>
                  <input 
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="9,90"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Preço Antigo</label>
                  <input 
                    value={form.oldPrice}
                    onChange={e => setForm({...form, oldPrice: e.target.value})}
                    placeholder="14,90"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descrição/Detalhes</label>
                <textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Mensagem WhatsApp</label>
                <input 
                  value={form.whatsappMsg}
                  onChange={e => setForm({...form, whatsappMsg: e.target.value})}
                  placeholder="Quero aproveitar a oferta do produto..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 pb-2 border-t border-slate-50">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                >
                  <Save size={18} />
                  Salvar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
