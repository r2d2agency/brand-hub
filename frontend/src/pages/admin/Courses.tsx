import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Plus, Trash2, Edit2, Save, X, GraduationCap, Calendar, Clock, MapPin, User
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface CourseForm {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  status: "SOON" | "OPEN" | "CLOSED";
  whatsappMsg: string;
  active: boolean;
  showInHome: boolean;
}

const EMPTY_FORM: CourseForm = {
  title: "",
  slug: "",
  description: "",
  coverImage: "",
  date: "",
  time: "",
  location: "",
  instructor: "",
  status: "OPEN",
  whatsappMsg: "",
  active: true,
  showInHome: true,
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const statusLabels: Record<string, string> = {
  SOON: "Em breve",
  OPEN: "Inscrições abertas",
  CLOSED: "Encerrado",
};

const statusColors: Record<string, string> = {
  SOON: "bg-amber-100 text-amber-700",
  OPEN: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-500",
};

export default function CoursesAdmin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => (await api.get("/admin-cms/courses")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin-cms/courses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  });

  const openNew = () => {
    setSelected(null);
    setForm(EMPTY_FORM);
    setIsEditing(true);
  };

  const openEdit = (c: any) => {
    setSelected(c);
    setForm({
      title: c.title || "",
      slug: c.slug || "",
      description: c.description || "",
      coverImage: c.coverImage || "",
      date: c.date ? new Date(c.date).toISOString().slice(0, 10) : "",
      time: c.time || "",
      location: c.location || "",
      instructor: c.instructor || "",
      status: c.status || "OPEN",
      whatsappMsg: c.whatsappMsg || "",
      active: c.active ?? true,
      showInHome: c.showInHome ?? true,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title) };
      if (selected) {
        await api.put(`/admin-cms/courses/${selected.id}`, payload);
      } else {
        await api.post("/admin-cms/courses", payload);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      setIsEditing(false);
    } catch (err: any) {
      alert("Erro ao salvar curso: " + (err?.response?.data?.error || err.message));
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Carregando cursos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cursos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Crie, agende e gerencie cursos. Vários por semana são suportados.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          Novo Curso
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c: any) => (
          <div
            key={c.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
              {c.coverImage ? (
                <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <GraduationCap size={40} />
                </div>
              )}
              <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${statusColors[c.status] || statusColors.SOON}`}>
                {statusLabels[c.status] || c.status}
              </span>
              {!c.active && (
                <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-black uppercase bg-slate-900/80 text-white">
                  Inativo
                </span>
              )}
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-slate-900 line-clamp-1">{c.title}</h3>
              <div className="text-xs text-slate-500 space-y-1">
                {c.date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(c.date).toLocaleDateString("pt-BR")}
                    {c.time && <><Clock size={12} className="ml-2" /> {c.time}</>}
                  </div>
                )}
                {c.instructor && (
                  <div className="flex items-center gap-1.5">
                    <User size={12} /> {c.instructor}
                  </div>
                )}
                {c.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {c.location}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-1 pt-2">
                <button onClick={() => openEdit(c)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => { if (confirm("Excluir curso?")) deleteMutation.mutate(c.id); }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            Nenhum curso cadastrado ainda.
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-blue-900">
                {selected ? "Editar Curso" : "Novo Curso"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <ImageUpload
                label="Capa do Curso"
                value={form.coverImage}
                onChange={url => setForm({ ...form, coverImage: url })}
                aspectClass="aspect-video"
                hint="1280x720px • paisagem (16:9)"
              />


              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Título *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => {
                      const title = e.target.value;
                      setForm(f => ({ ...f, title, slug: selected ? f.slug : slugify(title) }));
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Slug *</label>
                  <input
                    required
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    <option value="SOON">Em breve</option>
                    <option value="OPEN">Inscrições abertas</option>
                    <option value="CLOSED">Encerrado</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Data</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Horário</label>
                  <input
                    type="text"
                    placeholder="14h às 17h"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Instrutor(a)</label>
                  <input
                    value={form.instructor}
                    onChange={e => setForm({ ...form, instructor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Local</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Mensagem WhatsApp</label>
                <input
                  value={form.whatsappMsg}
                  onChange={e => setForm({ ...form, whatsappMsg: e.target.value })}
                  placeholder="Quero me inscrever no curso..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={e => setForm({ ...form, active: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  />
                  Ativo
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showInHome}
                    onChange={e => setForm({ ...form, showInHome: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  />
                  Mostrar na home
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
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
                  Salvar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
