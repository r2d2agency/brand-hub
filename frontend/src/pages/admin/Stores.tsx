import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Plus, Trash2, Edit2, Store, Phone, MessageCircle, MapPin, 
  Clock, Search, Navigation, Save, X, ImageIcon, Loader2
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface StoreForm {
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  hours: string;
  mapsLink: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  active: boolean;
}

const EMPTY_FORM: StoreForm = {
  name: "",
  address: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  whatsapp: "",
  hours: "",
  mapsLink: "",
  latitude: null,
  longitude: null,
  images: [],
  active: true,
};

export default function StoresAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [form, setForm] = useState<StoreForm>(EMPTY_FORM);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["admin-stores"],
    queryFn: async () => (await api.get("/admin-cms/stores")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin-cms/stores/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-stores"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (store: any) => 
      api.put(`/admin-cms/stores/${store.id}`, { active: !store.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-stores"] }),
  });

  const openNew = () => {
    setSelectedStore(null);
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const openEdit = (store: any) => {
    setSelectedStore(store);
    setForm({
      name: store.name || "",
      address: store.address || "",
      neighborhood: store.neighborhood || "",
      city: store.city || "",
      state: store.state || "",
      zipCode: store.zipCode || "",
      phone: store.phone || "",
      whatsapp: store.whatsapp || "",
      hours: store.hours || "",
      mapsLink: store.mapsLink || "",
      latitude: store.latitude || null,
      longitude: store.longitude || null,
      images: store.images || [],
      active: store.active ?? true,
    });
    setIsEditing(true);
  };

  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsSearchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          address: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          zipCode: cep
        }));

        // Geocoding based on the address (simplified)
        const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
        const geoData = await geoRes.json();
        
        if (geoData && geoData[0]) {
          setForm(prev => ({
            ...prev,
            latitude: parseFloat(geoData[0].lat),
            longitude: parseFloat(geoData[0].lon),
            mapsLink: `https://www.google.com/maps?q=${geoData[0].lat},${geoData[0].lon}`
          }));
        }
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedStore) {
        await api.put(`/admin-cms/stores/${selectedStore.id}`, form);
      } else {
        await api.post("/admin-cms/stores", form);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-stores"] });
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao salvar loja.");
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Carregando lojas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Unidades Basmar</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie os endereços e contatos das lojas físicas.</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Nova Loja
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store: any) => (
          <div key={store.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                <Store size={24} />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => openEdit(store)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(store.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{store.name}</h3>
            <div className="space-y-3 mt-4 text-sm text-slate-500">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span>{store.address}, {store.neighborhood} - {store.city}/{store.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-slate-400" />
                <span>{store.phone || "Sem telefone"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="shrink-0 text-green-500" />
                <span>{store.whatsapp || "Sem WhatsApp"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-slate-400" />
                <span>{store.hours || "Horário não definido"}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                <button 
                  onClick={() => toggleMutation.mutate(store)}
                  className={`h-2.5 w-8 rounded-full transition-colors ${store.active ? 'bg-green-500' : 'bg-slate-200'}`}
                />
              </div>
              {store.latitude && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  <Navigation size={10} />
                  Geo OK
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-blue-900">
                {selectedStore ? "Editar Loja" : "Nova Unidade"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nome da Unidade *</label>
                  <input 
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Ex: Unidade Centro"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">CEP (Busca Automática)</label>
                  <div className="relative">
                    <input 
                      value={form.zipCode}
                      onChange={e => {
                        setForm({...form, zipCode: e.target.value});
                        if (e.target.value.replace(/\D/g, "").length === 8) {
                          handleCepSearch(e.target.value);
                        }
                      }}
                      placeholder="00000-000"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                    {isSearchingCep && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="animate-spin text-blue-900" size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Endereço Completo *</label>
                <input 
                  required
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Bairro</label>
                  <input 
                    value={form.neighborhood}
                    onChange={e => setForm({...form, neighborhood: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Cidade</label>
                  <input 
                    value={form.city}
                    onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">UF</label>
                  <input 
                    value={form.state}
                    onChange={e => setForm({...form, state: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Telefone Fixo</label>
                  <input 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="(00) 0000-0000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">WhatsApp *</label>
                  <input 
                    required
                    value={form.whatsapp}
                    onChange={e => setForm({...form, whatsapp: e.target.value})}
                    placeholder="5500999999999"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Horário de Funcionamento</label>
                <input 
                  value={form.hours}
                  onChange={e => setForm({...form, hours: e.target.value})}
                  placeholder="Seg a Sex: 08h às 18h"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Fotos da Fachada</label>
                <ImageUpload 
                  label="Foto Principal"
                  value={form.images[0]}
                  onChange={url => setForm({...form, images: [url]})}
                  aspectClass="aspect-video"
                  hint="1280x720px • paisagem (16:9)"
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
                  className="flex items-center gap-2 rounded-xl bg-blue-900 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                >
                  <Save size={18} />
                  Salvar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}