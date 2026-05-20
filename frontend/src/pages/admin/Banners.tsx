import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Trash2, Edit2, Eye, EyeOff, Image as ImageIcon, Sparkles, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { BANNER_TEMPLATES, TEMPLATE_CATEGORIES, BannerTemplate } from "@/lib/bannerTemplates";

interface BannerForm {
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  buttonText: string;
  buttonLink: string;
  startDate: string;
  endDate: string;
  isDefault: boolean;
  fontFamily: string;
  fontSize: string;
  transitionTime: number;
  transitionType: string;
}

const EMPTY_FORM: BannerForm = {
  title: "",
  subtitle: "",
  imageDesktop: "",
  imageMobile: "",
  buttonText: "",
  buttonLink: "",
  startDate: "",
  endDate: "",
  isDefault: false,
  fontFamily: "Inter",
  fontSize: "4xl md:text-6xl lg:text-8xl",
  transitionTime: 5,
  transitionType: "fade",
};

export default function BannersAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);

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

  const openNew = () => {
    setSelectedBanner(null);
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const openEdit = (banner: any) => {
    setSelectedBanner(banner);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      imageDesktop: banner.imageDesktop || "",
      imageMobile: banner.imageMobile || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : "",
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : "",
      isDefault: banner.isDefault || false,
      fontFamily: banner.fontFamily || "Inter",
      fontSize: banner.fontSize || "4xl md:text-6xl lg:text-8xl",
      transitionTime: banner.transitionTime || 5,
      transitionType: banner.transitionType || "fade",
    });
    setIsEditing(true);
  };

  const applyTemplate = (template: BannerTemplate) => {
    setForm({
      ...EMPTY_FORM,
      title: template.data.title,
      subtitle: template.data.subtitle,
      imageDesktop: template.data.imageDesktop,
      imageMobile: template.data.imageMobile || "",
      buttonText: template.data.buttonText,
      buttonLink: template.data.buttonLink,
    });
    setShowTemplates(false);
    setSelectedBanner(null);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        subtitle: form.subtitle || null,
        imageMobile: form.imageMobile || null,
        buttonText: form.buttonText || null,
        buttonLink: form.buttonLink || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      if (selectedBanner) {
        await api.put(`/admin-cms/banners/${selectedBanner.id}`, payload);
      } else {
        await api.post("/admin-cms/banners", payload);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      setIsEditing(false);
    } catch (err) {
      alert("Erro ao salvar banner. Verifique os campos obrigatórios.");
    }
  };

  const filteredTemplates = activeCategory === "Todos"
    ? BANNER_TEMPLATES
    : BANNER_TEMPLATES.filter(t => t.category === activeCategory);

  if (isLoading) return <div className="p-8 text-slate-500">Carregando banners...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners Sazonais</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie os slides do Hero (PC e Mobile).</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 rounded-lg border-2 border-blue-900 bg-white px-4 py-2 text-sm font-bold text-blue-900 hover:bg-blue-50 transition-colors"
          >
            <Sparkles size={18} />
            Galeria de Modelos
          </button>
          <button 
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
          >
            <Plus size={18} />
            Novo Banner
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {banners.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
            <div className="text-slate-500 font-medium mb-4">Nenhum banner cadastrado ainda.</div>
            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              <Sparkles size={18} />
              Escolher um modelo pronto
            </button>
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
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">{banner.title}</h3>
                      <p className="text-sm text-slate-500">{banner.subtitle || "Sem subtítulo"}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => toggleMutation.mutate(banner)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600"
                        title={banner.active ? "Desativar" : "Ativar"}
                      >
                        {banner.active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => openEdit(banner)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("Deseja realmente excluir este banner?")) {
                            deleteMutation.mutate(banner.id);
                          }
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
                      Mobile: {banner.imageMobile ? "Personalizada" : "Usa desktop"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TEMPLATES GALLERY MODAL */}
      {showTemplates && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
                  <Sparkles className="text-red-600" /> Galeria de Modelos
                </h2>
                <p className="text-sm text-slate-500 mt-1">Escolha um modelo e personalize do seu jeito.</p>
              </div>
              <button onClick={() => setShowTemplates(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 pt-4 flex gap-2 flex-wrap border-b border-slate-50 pb-4">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="group text-left rounded-xl overflow-hidden border-2 border-slate-100 bg-white hover:border-red-500 hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                      <img src={template.preview} alt={template.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 rounded-md bg-blue-900/80 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        {template.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs font-bold text-red-300 uppercase tracking-widest">{template.data.buttonText}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-black text-blue-900 group-hover:text-red-600 transition-colors">{template.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{template.data.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/CREATE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black text-blue-900">
                {selectedBanner ? "Editar Banner" : "Novo Banner"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Título *</label>
                  <input 
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    required 
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Subtítulo</label>
                  <input 
                    value={form.subtitle}
                    onChange={(e) => setForm({...form, subtitle: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <ImageUpload
                label="Imagem Desktop *"
                value={form.imageDesktop}
                onChange={(v) => setForm({...form, imageDesktop: v})}
                aspectClass="aspect-[21/9]"
              />

              <ImageUpload
                label="Imagem Mobile (opcional)"
                value={form.imageMobile}
                onChange={(v) => setForm({...form, imageMobile: v})}
                aspectClass="aspect-[9/16] max-h-72"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Texto do Botão</label>
                  <input 
                    value={form.buttonText}
                    onChange={(e) => setForm({...form, buttonText: e.target.value})}
                    placeholder="Ex: Ver Catálogo"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Início da Exibição</label>
                  <input 
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm({...form, startDate: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Fim da Exibição</label>
                  <input 
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setForm({...form, endDate: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => setForm({...form, isDefault: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span className="text-sm font-bold text-slate-700">Banner Padrão?</span>
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Fonte do Título</label>
                  <select 
                    value={form.fontFamily}
                    onChange={(e) => setForm({...form, fontFamily: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    <option value="Inter">Inter (Padrão)</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Playfair Display">Playfair Display (Serifada)</option>
                    <option value="Bebas Neue">Bebas Neue (Impactante)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Classes de Tamanho (Tailwind)</label>
                  <input 
                    value={form.fontSize}
                    onChange={(e) => setForm({...form, fontSize: e.target.value})}
                    placeholder="Ex: text-4xl md:text-6xl"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Tempo de Transição (segundos)</label>
                  <input 
                    type="number"
                    value={form.transitionTime}
                    onChange={(e) => setForm({...form, transitionTime: Number(e.target.value)})}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Tipo de Transição</label>
                  <select 
                    value={form.transitionType}
                    onChange={(e) => setForm({...form, transitionType: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    <option value="fade">Esmaecer (Fade)</option>
                    <option value="slide">Deslizar (Slide)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Link do Botão</label>
                  <input 
                    value={form.buttonLink}
                    onChange={(e) => setForm({...form, buttonLink: e.target.value})}
                    placeholder="/categorias"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
