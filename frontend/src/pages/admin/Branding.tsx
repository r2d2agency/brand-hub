import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Branding } from "@/lib/branding";
import { 
  Palette, 
  Layout, 
  Share2, 
  MessageCircle, 
  Save, 
  Type, 
  Image as ImageIcon 
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function BrandingAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Branding>({
    queryKey: ["branding"],
    queryFn: async () => (await api.get("/branding")).data,
  });
  
  const [form, setForm] = useState<Partial<Branding>>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: Partial<Branding>) => (await api.put("/branding", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branding"] });
      setMsg("Identidade visual atualizada!");
      setTimeout(() => setMsg(""), 3000);
    },
  });

  if (isLoading) return <div className="p-8 text-slate-500">Carregando identidade visual...</div>;

  const handleFieldChange = (key: keyof Branding, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branding</h1>
          <p className="mt-1 text-sm text-slate-500">Personalize a identidade visual, cores e rodapé do seu site.</p>
        </div>
        <div className="flex items-center gap-4">
          {msg && <span className="text-sm font-bold text-green-600 animate-fade-in">{msg}</span>}
          <button 
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Save size={18} />
            {mutation.isPending ? "Salvando..." : "Salvar Branding"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Core Identity */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Type className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Identidade Geral</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nome do Site</label>
                <input 
                  value={form.siteName || ""}
                  onChange={e => handleFieldChange("siteName", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Tagline / Slogan</label>
                <input 
                  value={form.tagline || ""}
                  onChange={e => handleFieldChange("tagline", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <ImageUpload 
                  label="Logo Principal"
                  value={form.logoUrl || ""}
                  onChange={url => handleFieldChange("logoUrl", url)}
                  aspectClass="aspect-video"
                  hint="400x200px • PNG transparente"
                />
                <ImageUpload 
                  label="Favicon (Ícone)"
                  value={form.faviconUrl || ""}
                  onChange={url => handleFieldChange("faviconUrl", url)}
                  aspectClass="aspect-square"
                  hint="64x64px • PNG ou ICO"
                />

              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Palette className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Cores & Tipografia</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Cor Primária</span>
                  <input type="color" value={form.primaryColor || "#e91e63"} onChange={e => handleFieldChange("primaryColor", e.target.value)} className="h-12 w-full border-none cursor-pointer rounded-xl overflow-hidden shadow-sm" />
                  <input type="text" value={form.primaryColor || ""} onChange={e => handleFieldChange("primaryColor", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-mono text-center" />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Cor Secundária</span>
                  <input type="color" value={form.secondaryColor || "#9c27b0"} onChange={e => handleFieldChange("secondaryColor", e.target.value)} className="h-12 w-full border-none cursor-pointer rounded-xl overflow-hidden shadow-sm" />
                  <input type="text" value={form.secondaryColor || ""} onChange={e => handleFieldChange("secondaryColor", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-mono text-center" />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Botão Global (Fundo)</span>
                  <input type="color" value={form.buttonBgColor || "#e91e63"} onChange={e => handleFieldChange("buttonBgColor", e.target.value)} className="h-12 w-full border-none cursor-pointer rounded-xl overflow-hidden shadow-sm" />
                  <input type="text" value={form.buttonBgColor || ""} onChange={e => handleFieldChange("buttonBgColor", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-mono text-center" />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Fonte Títulos (Google Fonts)</span>
                  <select 
                    value={form.fontHeading || "Inter"} 
                    onChange={e => handleFieldChange("fontHeading", e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    {['Inter', 'Montserrat', 'Poppins', 'Roboto', 'Open Sans', 'Oswald', 'Playfair Display', 'Lora', 'Bebas Neue', 'Pacifico'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Fonte Corpo (Google Fonts)</span>
                  <select 
                    value={form.fontBody || "Inter"} 
                    onChange={e => handleFieldChange("fontBody", e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    {['Inter', 'Montserrat', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Raleway', 'Nunito'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Botão Global (Texto)</span>
                  <input type="color" value={form.buttonTextColor || "#ffffff"} onChange={e => handleFieldChange("buttonTextColor", e.target.value)} className="h-12 w-full border-none cursor-pointer rounded-xl overflow-hidden shadow-sm" />
                  <input type="text" value={form.buttonTextColor || ""} onChange={e => handleFieldChange("buttonTextColor", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-mono text-center" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & WhatsApp */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Layout className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Personalização do Rodapé</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Texto Institucional (Rodapé)</label>
                <textarea 
                  value={form.footerText || ""}
                  onChange={e => handleFieldChange("footerText", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Texto Introdução — Seção de Cursos</label>
                <textarea
                  value={(form as any).coursesIntro || ""}
                  onChange={e => handleFieldChange("coursesIntro" as any, e.target.value)}
                  rows={3}
                  placeholder="Texto curto exibido acima do carrossel de cursos na home."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-900 focus:outline-none resize-none"
                />
              </div>


              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Cor Fundo Rodapé</span>
                  <input type="color" value={form.footerBgColor || "#0f172a"} onChange={e => handleFieldChange("footerBgColor", e.target.value)} className="h-12 w-full border-none cursor-pointer rounded-xl overflow-hidden shadow-sm" />
                  <input type="text" value={form.footerBgColor || ""} onChange={e => handleFieldChange("footerBgColor", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-mono text-center" />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-1">Cor Texto Rodapé</span>
                  <input type="color" value={form.footerTextColor || "#ffffff"} onChange={e => handleFieldChange("footerTextColor", e.target.value)} className="h-12 w-full border-none cursor-pointer rounded-xl overflow-hidden shadow-sm" />
                  <input type="text" value={form.footerTextColor || ""} onChange={e => handleFieldChange("footerTextColor", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-mono text-center" />
                </label>
              </div>

              <ImageUpload 
                label="Logo para Rodapé"
                value={form.footerLogo || ""}
                onChange={url => handleFieldChange("footerLogo", url)}
                aspectClass="aspect-video"
                hint="400x200px • PNG transparente (claro)"
              />

            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Share2 className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">Redes Sociais</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instagram</label>
                <div className="flex gap-2">
                  <input type="color" value={form.instagramColor || "#e1306c"} onChange={e => handleFieldChange("instagramColor", e.target.value)} className="h-10 w-10 border-none cursor-pointer rounded-lg overflow-hidden" />
                  <input value={form.instagramUrl || ""} onChange={e => handleFieldChange("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Facebook</label>
                <div className="flex gap-2">
                  <input type="color" value={form.facebookColor || "#1877f2"} onChange={e => handleFieldChange("facebookColor", e.target.value)} className="h-10 w-10 border-none cursor-pointer rounded-lg overflow-hidden" />
                  <input value={form.facebookUrl || ""} onChange={e => handleFieldChange("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">YouTube</label>
                <div className="flex gap-2">
                  <input type="color" value={form.youtubeColor || "#ff0000"} onChange={e => handleFieldChange("youtubeColor", e.target.value)} className="h-10 w-10 border-none cursor-pointer rounded-lg overflow-hidden" />
                  <input value={form.youtubeUrl || ""} onChange={e => handleFieldChange("youtubeUrl", e.target.value)} placeholder="https://youtube.com/c/..." className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <MessageCircle className="text-blue-900" size={20} />
              <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">WhatsApp Flutuante</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Número (Ex: 5511999999999)</label>
                <input value={form.whatsappPhone || ""} onChange={e => handleFieldChange("whatsappPhone", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mensagem Padrão</label>
                <input value={form.whatsappMessage || ""} onChange={e => handleFieldChange("whatsappMessage", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
