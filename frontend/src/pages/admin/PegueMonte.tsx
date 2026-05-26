import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  PartyPopper,
  Save,
  Search,
  Filter
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import GalleryUpload from "@/components/GalleryUpload";

interface PegueMonteKit {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  gallery: string[];
  active: boolean;
  highlight: boolean;
  theme?: string;
  partyType?: string;
  videoUrl?: string;
  items?: string[];
  storePhones?: { name: string; phone: string }[];
}

export default function PegueMonteAdmin() {
  const qc = useQueryClient();
  const { data: kits = [], isLoading } = useQuery<PegueMonteKit[]>({
    queryKey: ["admin-pegue-monte"],
    queryFn: async () => (await api.get("/admin-cms/pegue-monte")).data,
  });

  const [msg, setMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) {
        return (await api.put(`/admin-cms/pegue-monte/${payload.id}`, payload)).data;
      }
      return (await api.post("/admin-cms/pegue-monte", payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pegue-monte"] });
      setMsg("Kit salvo com sucesso!");
      setTimeout(() => setMsg(""), 3000);
    },
    onError: (err: any) => {
      console.error(err);
      alert("Erro ao salvar kit.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/admin-cms/pegue-monte/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pegue-monte"] });
    }
  });

  const addKit = () => {
    const name = prompt("Nome do kit ou item:");
    if (!name) return;
    
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    
    saveMutation.mutate({
      name,
      slug,
      description: "",
      coverImage: "",
      gallery: [],
      active: true,
      highlight: false,
      videoUrl: "",
      items: []
    });
  };

  const updateKit = (id: string, data: Partial<PegueMonteKit>) => {
    const kit = kits.find(k => k.id === id);
    if (!kit) return;
    saveMutation.mutate({ ...kit, ...data });
  };

  const filteredKits = kits.filter(k => 
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.theme && k.theme.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="p-8 text-slate-500 text-center">Carregando kits...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pegue e Monte</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie os kits de decoração e itens individuais.</p>
        </div>
        <div className="flex items-center gap-4">
          {msg && <span className="text-sm font-bold text-green-600 animate-fade-in">{msg}</span>}
          <button 
            onClick={addKit}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} />
            Novo Kit/Item
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nome ou tema..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredKits.map((kit) => (
          <div key={kit.id} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64">
                <ImageUpload 
                  label="Imagem de Capa"
                  value={kit.coverImage}
                  onChange={url => updateKit(kit.id, { coverImage: url })}
                  aspectClass="aspect-[4/5]"
                  hint="800x1000px • retrato (4:5)"
                />

              </div>

              <div className="flex-1 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nome</label>
                    <input 
                      defaultValue={kit.name}
                      onBlur={e => updateKit(kit.id, { name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                  </div>
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Tema</label>
                    <input 
                      defaultValue={kit.theme}
                      onBlur={e => updateKit(kit.id, { theme: e.target.value })}
                      placeholder="Ex: Realeza..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                  </div>
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">YouTube Video URL</label>
                    <input 
                      defaultValue={kit.videoUrl}
                      onBlur={e => updateKit(kit.id, { videoUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descrição</label>
                  <textarea 
                    defaultValue={kit.description}
                    onBlur={e => updateKit(kit.id, { description: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Itens Inclusos (um por linha)</label>
                  <textarea 
                    defaultValue={kit.items?.join('\n')}
                    onBlur={e => updateKit(kit.id, { items: e.target.value.split('\n').filter(i => i.trim()) })}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none" 
                    placeholder="Mesa rústica&#10;Painel de balões..."
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Lojas e WhatsApps</label>
                    <button 
                      onClick={() => {
                        const current = kit.storePhones || [];
                        updateKit(kit.id, { storePhones: [...current, { name: '', phone: '' }] });
                      }}
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-900 hover:text-red-600 transition-colors"
                    >
                      <Plus size={12} />
                      Adicionar Loja
                    </button>
                  </div>
                  
                  <div className="grid gap-2">
                    {(kit.storePhones || []).map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          value={sp.name}
                          onChange={e => {
                            const newPhones = [...(kit.storePhones || [])];
                            newPhones[idx].name = e.target.value;
                            updateKit(kit.id, { storePhones: newPhones });
                          }}
                          placeholder="Nome da Loja (ex: Loja A)"
                          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-900 focus:outline-none" 
                        />
                        <input 
                          value={sp.phone}
                          onChange={e => {
                            const newPhones = [...(kit.storePhones || [])];
                            newPhones[idx].phone = e.target.value;
                            updateKit(kit.id, { storePhones: newPhones });
                          }}
                          placeholder="WhatsApp (ex: 5511...)"
                          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-900 focus:outline-none" 
                        />
                        <button 
                          onClick={() => {
                            const newPhones = (kit.storePhones || []).filter((_, i) => i !== idx);
                            updateKit(kit.id, { storePhones: newPhones });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(kit.storePhones || []).length === 0 && (
                      <p className="text-[10px] text-slate-400 italic">Nenhuma loja específica configurada. Usará o WhatsApp padrão.</p>
                    )}
                  </div>
                </div>



                <GalleryUpload
                  value={kit.gallery || []}
                  onChange={(gallery) => updateKit(kit.id, { gallery })}
                  label="Galeria de Fotos"
                  max={20}
                />

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={kit.active}
                      onChange={e => updateKit(kit.id, { active: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span className="text-sm font-bold text-slate-700">Ativo no site</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={kit.highlight}
                      onChange={e => updateKit(kit.id, { highlight: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-600"
                    />
                    <span className="text-sm font-bold text-slate-700">Destaque na Home</span>
                  </label>
                  
                  <div className="ml-auto flex items-center gap-3">
                    <button 
                      onClick={() => deleteMutation.mutate(kit.id)}
                      className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredKits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
            <PartyPopper className="text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Nenhum kit encontrado.</p>
            <button 
              onClick={addKit}
              className="mt-4 text-blue-900 font-bold hover:underline"
            >
              Adicionar novo kit agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
