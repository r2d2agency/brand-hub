import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Trash2, Edit2, Eye, EyeOff, MoveUp, MoveDown, Image as ImageIcon } from "lucide-react";

export default function BannersAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => (await api.get("/admin-cms/banners")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin-cms/banners/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (banner: any) => 
      api.put(`/admin-cms/banners/${banner.id}`, { active: !banner.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  if (isLoading) return <div className="p-8 text-slate-500">Carregando banners...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners Sazonais</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie os slides da página inicial (PC e Mobile).</p>
        </div>
        <button 
          onClick={() => {
            setSelectedBanner(null);
            setIsEditing(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Novo Banner
        </button>
      </div>

      <div className="grid gap-6">
        {banners.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
            Nenhum banner cadastrado. Clique em "Novo Banner" para começar.
          </div>
        ) : (
          banners.map((banner: any) => (
            <div key={banner.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className="relative aspect-[21/9] w-full md:w-64 overflow-hidden bg-slate-100">
                  {banner.imageDesktop ? (
                    <img src={banner.imageDesktop} alt={banner.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${banner.active ? 'bg-green-500' : 'bg-slate-400'}`}>
                      {banner.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">{banner.title}</h3>
                      <p className="text-sm text-slate-500">{banner.subtitle || "Sem subtítulo"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleMutation.mutate(banner)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        title={banner.active ? "Desativar" : "Ativar"}
                      >
                        {banner.active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedBanner(banner);
                          setIsEditing(true);
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Deseja realmente excluir este banner?")) {
                            deleteMutation.mutate(banner.id);
                          }
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      Botão: {banner.buttonText || "Nenhum"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      Mobile: {banner.imageMobile ? "Sim" : "Não"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                      Ordem: {banner.order}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal/Overlay simplificado para edição (Em um app real, usaríamos um componente separado) */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              {selectedBanner ? "Editar Banner" : "Novo Banner"}
            </h2>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                
                try {
                  if (selectedBanner) {
                    await api.put(`/admin-cms/banners/${selectedBanner.id}`, data);
                  } else {
                    await api.post("/admin-cms/banners", data);
                  }
                  queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
                  setIsEditing(false);
                } catch (err) {
                  alert("Erro ao salvar banner. Verifique os campos.");
                }
              }}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Título</label>
                  <input name="title" defaultValue={selectedBanner?.title} required className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Subtítulo</label>
                  <input name="subtitle" defaultValue={selectedBanner?.subtitle} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Imagem Desktop (URL)</label>
                <input name="imageDesktop" defaultValue={selectedBanner?.imageDesktop} required className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" placeholder="https://..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Imagem Mobile (URL - Opcional)</label>
                <input name="imageMobile" defaultValue={selectedBanner?.imageMobile} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" placeholder="https://..." />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Texto do Botão</label>
                  <input name="buttonText" defaultValue={selectedBanner?.buttonText} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Link do Botão</label>
                  <input name="buttonLink" defaultValue={selectedBanner?.buttonLink} className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="rounded-lg bg-red-600 px-6 py-2 text-sm font-bold text-white hover:bg-red-700"
                >
                  Salvar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
