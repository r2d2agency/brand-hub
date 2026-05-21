import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Plus, Trash2, Edit2, Play, Video, 
  Save, X, ImageIcon, Youtube, Tag
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface NewsVideoForm {
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  tags: string[];
  orientation: "horizontal" | "vertical";
  active: boolean;
  order: number;
}

const EMPTY_FORM: NewsVideoForm = {
  title: "",
  youtubeUrl: "",
  thumbnail: "",
  tags: [],
  orientation: "horizontal",
  active: true,
  order: 0,
};

export default function NewsVideosAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [form, setForm] = useState<NewsVideoForm>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["admin-news-videos"],
    queryFn: async () => (await api.get("/admin-cms/news-videos")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin-cms/news-videos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-news-videos"] }),
  });

  const openNew = () => {
    setSelectedVideo(null);
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const openEdit = (video: any) => {
    setSelectedVideo(video);
    setForm({
      title: video.title || "",
      youtubeUrl: video.youtubeUrl || "",
      thumbnail: video.thumbnail || "",
      tags: video.tags || [],
      orientation: video.orientation || "horizontal",
      active: video.active ?? true,
      order: video.order || 0,
    });
    setIsEditing(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedVideo) {
        await api.put(`/admin-cms/news-videos/${selectedVideo.id}`, form);
      } else {
        await api.post("/admin-cms/news-videos", form);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-news-videos"] });
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao salvar vídeo.");
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Carregando vídeos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novidades & Vídeos</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie vídeos do YouTube (Shorts ou horizontais) para a seção de novidades.</p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          Novo Vídeo
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video: any) => (
          <div key={video.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className={`relative overflow-hidden bg-slate-100 ${video.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'}`}>
              {video.thumbnail ? (
                <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Video size={40} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-red-600 p-3 text-white shadow-xl">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              {video.tags && video.tags.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {video.tags.map((tag: string) => (
                    <span key={tag} className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-slate-900 line-clamp-1">{video.title}</h3>
              <p className="mt-1 text-xs text-slate-400 truncate">{video.youtubeUrl}</p>
              
              <div className="mt-4 flex justify-end gap-1">
                <button onClick={() => openEdit(video)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => { if(confirm("Excluir vídeo?")) deleteMutation.mutate(video.id) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-blue-900">
                {selectedVideo ? "Editar Vídeo" : "Novo Vídeo Novidade"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ImageUpload 
                  label="Capa do Vídeo *"
                  value={form.thumbnail}
                  onChange={url => setForm({...form, thumbnail: url})}
                  aspectClass={form.orientation === 'vertical' ? "aspect-[9/16]" : "aspect-video"}
                  hint={form.orientation === 'vertical' ? "720x1280px • retrato (9:16)" : "1280x720px • paisagem (16:9)"}
                />

                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Orientação</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setForm({...form, orientation: 'horizontal'})}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${form.orientation === 'horizontal' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                      >
                        <Youtube size={18} />
                        Horizontal
                      </button>
                      <button 
                        type="button"
                        onClick={() => setForm({...form, orientation: 'vertical'})}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${form.orientation === 'vertical' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                      >
                        <Video size={18} />
                        Shorts
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Link do YouTube *</label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        required
                        type="url"
                        value={form.youtubeUrl}
                        onChange={e => setForm({...form, youtubeUrl: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Título do Vídeo *</label>
                <input 
                  required
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Tags (Dica, Curiosidade...)</label>
                <div className="flex gap-2">
                  <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Adicionar tag..."
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                  <button 
                    type="button"
                    onClick={addTag}
                    className="rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-black"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
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
                  Salvar Vídeo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
