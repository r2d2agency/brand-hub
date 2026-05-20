import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Save, 
  Plus, 
  Trash2, 
  History, 
  Layout, 
  Image as ImageIcon,
  Video
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  image?: string;
}

interface HistoryForm {
  title: string;
  content: string;
  mainImage: string;
  gallery: string[];
  timeline: TimelineItem[];
}

export default function HistoryAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-history"],
    queryFn: async () => (await api.get("/admin-cms/history")).data,
  });

  const [form, setForm] = useState<HistoryForm>({
    title: "",
    content: "",
    mainImage: "",
    gallery: [],
    timeline: [],
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        content: data.content || "",
        mainImage: data.mainImage || "",
        gallery: data.gallery || [],
        timeline: Array.isArray(data.timeline) ? data.timeline : [],
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: HistoryForm) => (await api.put("/admin-cms/history", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-history"] });
      setMsg("Alterações salvas com sucesso!");
      setTimeout(() => setMsg(""), 3000);
    },
    onError: () => {
      alert("Erro ao salvar história.");
    }
  });

  const addTimelineItem = () => {
    setForm({
      ...form,
      timeline: [...form.timeline, { year: "", title: "", desc: "" }]
    });
  };

  const removeTimelineItem = (index: number) => {
    const newTimeline = [...form.timeline];
    newTimeline.splice(index, 1);
    setForm({ ...form, timeline: newTimeline });
  };

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const newTimeline = [...form.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setForm({ ...form, timeline: newTimeline });
  };

  const handleGalleryChange = (url: string) => {
    if (url && !form.gallery.includes(url)) {
      setForm({ ...form, gallery: [...form.gallery, url] });
    }
  };

  const removeGalleryImage = (url: string) => {
    setForm({ ...form, gallery: form.gallery.filter(img => img !== url) });
  };

  if (isLoading) return <div className="p-8 text-slate-500">Carregando dados da história...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nossa História</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie o conteúdo da página "Sobre Nós".</p>
        </div>
        <div className="flex items-center gap-4">
          {msg && <span className="text-sm font-bold text-green-600 animate-fade-in">{msg}</span>}
          <button 
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Save size={18} />
            {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Layout className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Informações Principais</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Título da Página</label>
                <input 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="Ex: Nossa História"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Texto da História (Quem Somos)</label>
                <textarea 
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  rows={10}
                  placeholder="Conte a trajetória da Basmar..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none leading-relaxed" 
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <History className="text-blue-900" size={20} />
                <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Linha do Tempo</h2>
              </div>
              <button 
                onClick={addTimelineItem}
                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                <Plus size={14} />
                Adicionar Evento
              </button>
            </div>

            <div className="space-y-4">
              {form.timeline.map((item, index) => (
                <div key={index} className="relative rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <button 
                    onClick={() => removeTimelineItem(index)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ano</label>
                      <input 
                        value={item.year}
                        onChange={e => updateTimelineItem(index, 'year', e.target.value)}
                        placeholder="1991"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título</label>
                      <input 
                        value={item.title}
                        onChange={e => updateTimelineItem(index, 'title', e.target.value)}
                        placeholder="Ex: Fundação da primeira loja"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição</label>
                      <textarea 
                        value={item.desc}
                        onChange={e => updateTimelineItem(index, 'desc', e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none resize-none" 
                      />
                    </div>
                  </div>
                </div>
              ))}
              {form.timeline.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm italic">
                  Nenhum evento na linha do tempo.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Main Image */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ImageIcon className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Imagem de Destaque</h2>
            </div>
            <ImageUpload 
              value={form.mainImage}
              onChange={url => setForm({...form, mainImage: url})}
              aspectClass="aspect-square"
            />
          </div>

          {/* Gallery */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ImageIcon className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Galeria de Fotos</h2>
            </div>
            
            <ImageUpload 
              label="Adicionar Foto"
              value=""
              onChange={handleGalleryChange}
              aspectClass="aspect-video"
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              {form.gallery.map((img, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={img} className="h-full w-full object-cover" />
                  <button 
                    onClick={() => removeGalleryImage(img)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-lg bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="rounded-2xl bg-blue-900 p-6 text-white shadow-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-800 p-3">
                <Video size={24} className="text-red-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider">Vídeos na História</h4>
                <p className="mt-2 text-xs text-blue-200 leading-relaxed">
                  Para adicionar vídeos, você pode usar a seção de "Novidades" com a tag "História" ou inserir o link do vídeo diretamente no texto acima.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
