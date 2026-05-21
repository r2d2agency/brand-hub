import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Building2
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Partner {
  id: string;
  name: string;
  logo: string;
  order: number;
}

export default function PartnersAdmin() {
  const qc = useQueryClient();
  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ["admin-partners"],
    queryFn: async () => (await api.get("/admin-cms/partners")).data,
  });

  const [msg, setMsg] = useState("");


  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const data = {
        name: payload.name || "Novo Parceiro",
        logo: payload.logo || "https://placehold.co/200x100?text=Logo",
        order: typeof payload.order === 'number' ? payload.order : partners.length,
        active: payload.active !== undefined ? payload.active : true
      };

      if (payload.id) {
        return (await api.put(`/admin-cms/partners/${payload.id}`, data)).data;
      }
      return (await api.post("/admin-cms/partners", data)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-partners"] });
      setMsg("Parceiro salvo com sucesso!");
      setTimeout(() => setMsg(""), 3000);
    },
    onError: (err: any) => {
      console.error("Erro ao salvar parceiro:", err.response?.data || err.message);
      alert("Erro ao salvar parceiro. Verifique se o nome e a logo estão preenchidos.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin-cms/partners/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-partners"] });
    }
  });

  const addPartner = () => {
    const newPartner: any = {
      name: "Novo Parceiro",
      logo: "",
      order: partners.length
    };
    saveMutation.mutate(newPartner);
  };

  const removePartner = (id: string) => {
    if (confirm("Deseja remover este parceiro?")) {
      deleteMutation.mutate(id);
    }
  };

  const updatePartner = (index: number, field: keyof Partner, value: any) => {
    const partner = partners[index];
    if (!partner) return;
    saveMutation.mutate({ ...partner, [field]: value });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newPartners = [...partners].sort((a, b) => (a.order || 0) - (b.order || 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPartners.length) return;

    const temp = newPartners[index];
    newPartners[index] = newPartners[targetIndex];
    newPartners[targetIndex] = temp;

    Promise.all(newPartners.map((p, i) => 
      api.put(`/admin-cms/partners/${p.id}`, { ...p, order: i })
    )).then(() => {
      qc.invalidateQueries({ queryKey: ["admin-partners"] });
    });
  };

  if (isLoading) return <div className="p-8 text-slate-500 text-center">Carregando parceiros...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parceiros e Marcas</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie as logos que aparecem no carrossel da home.</p>
        </div>
        <div className="flex items-center gap-4">
          {msg && <span className="text-sm font-bold text-green-600 animate-fade-in">{msg}</span>}
          <button 
            onClick={addPartner}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} />
            Adicionar Parceiro
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {[...partners].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((partner, index) => (
          <div key={partner.id || index} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48">
                <ImageUpload 
                  label="Logo"
                  value={partner.logo}
                  onChange={url => updatePartner(index, 'logo', url)}
                  aspectClass="aspect-video"
                  hint="400x225px • PNG transparente"
                />

              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nome da Marca</label>
                  <input 
                    key={partner.id}
                    defaultValue={partner.name}
                    onBlur={e => updatePartner(index, 'name', e.target.value)}
                    placeholder="Ex: Nestlé"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button 
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30"
                  >
                    <MoveUp size={18} />
                  </button>
                  <button 
                    disabled={index === partners.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30"
                  >
                    <MoveDown size={18} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removePartner(partner.id)}
                  className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {partners.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <Building2 className="text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Nenhum parceiro cadastrado.</p>
            <button 
              onClick={addPartner}
              className="mt-4 text-blue-900 font-bold hover:underline"
            >
              Clique aqui para adicionar o primeiro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
