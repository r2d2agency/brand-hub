import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Plus, Trash2, Edit2, Eye, EyeOff, 
  Image as ImageIcon, Sparkles, X, GripVertical, Save 
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import BannerPreview from "@/components/BannerPreview";
import { BANNER_TEMPLATES, TEMPLATE_CATEGORIES, BannerTemplate } from "@/lib/bannerTemplates";
import * as Switch from "@radix-ui/react-switch";

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  fontSize: "text-4xl md:text-6xl lg:text-8xl",
  transitionTime: 5,
  transitionType: "fade",
};

// Sortable Item Component
function SortableBannerItem({ 
  banner, 
  onEdit, 
  onDelete, 
  onToggle 
}: { 
  banner: any; 
  onEdit: (b: any) => void; 
  onDelete: (id: string) => void;
  onToggle: (b: any) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex flex-col md:flex-row">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="flex items-center justify-center w-8 bg-slate-50 border-r border-slate-100 cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors"
        >
          <GripVertical size={16} className="text-slate-400" />
        </div>

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
              <div className="flex items-center gap-2 mr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <Switch.Root
                  checked={banner.active}
                  onCheckedChange={() => onToggle(banner)}
                  className="w-10 h-5 bg-slate-200 rounded-full relative data-[state=checked]:bg-green-500 outline-none cursor-pointer transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>
              
              <button 
                onClick={() => onEdit(banner)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => {
                  if (confirm("Deseja realmente excluir este banner?")) {
                    onDelete(banner.id);
                  }
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Excluir"
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
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-300"></div>
              Ordem: {banner.order}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => api.post("/admin-cms/banners/reorder", { ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((b: any) => b.id === active.id);
      const newIndex = banners.findIndex((b: any) => b.id === over.id);
      const newBanners = arrayMove(banners, oldIndex, newIndex);
      reorderMutation.mutate(newBanners.map((b: any) => b.id));
    }
  };

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
      fontSize: banner.fontSize || "text-4xl md:text-6xl lg:text-8xl",
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
          <p className="mt-1 text-sm text-slate-500">Gerencie os slides do Hero (PC e Mobile). Arraste para reordenar.</p>
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

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
            <SortableContext 
              items={banners.map((b: any) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {banners.map((banner: any) => (
                <SortableBannerItem 
                  key={banner.id} 
                  banner={banner} 
                  onEdit={openEdit}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onToggle={(b) => toggleMutation.mutate(b)}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>

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
          <div className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col md:flex-row">
            
            {/* Form Side */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-blue-900">
                  {selectedBanner ? "Editar Banner" : "Novo Banner"}
                </h2>
                <button onClick={() => setIsEditing(false)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="grid gap-4 md:grid-cols-2">
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
                    aspectClass="aspect-[9/16] max-h-48"
                  />
                </div>

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
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Link do Botão</label>
                    <input 
                      value={form.buttonLink}
                      onChange={(e) => setForm({...form, buttonLink: e.target.value})}
                      placeholder="Ex: /categorias/doces"
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none" 
                    />
                  </div>
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
                        className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900 transition-all"
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

                <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t border-slate-50">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-blue-900 px-8 py-2 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
                  >
                    <Save size={18} />
                    Salvar Banner
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Side */}
            <div className="hidden md:flex flex-[0.8] flex-col bg-slate-50 p-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">Visualização</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <BannerPreview 
                  title={form.title}
                  subtitle={form.subtitle}
                  imageDesktop={form.imageDesktop}
                  imageMobile={form.imageMobile}
                  buttonText={form.buttonText}
                  fontFamily={form.fontFamily}
                  fontSize={form.fontSize}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
