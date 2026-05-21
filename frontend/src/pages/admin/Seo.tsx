import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Branding } from "@/lib/branding";
import {
  Save,
  Search,
  Share2,
  BarChart3,
  Code2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function SeoAdmin() {
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
    mutationFn: async (payload: Partial<Branding>) =>
      (await api.put("/branding", payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branding"] });
      setMsg("Configurações de SEO salvas!");
      setTimeout(() => setMsg(""), 3000);
    },
  });

  if (isLoading)
    return <div className="p-8 text-slate-500">Carregando SEO...</div>;

  const set = (key: keyof Branding, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO & Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure metadados, compartilhamento social, rastreamento e códigos
            personalizados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {msg && (
            <span className="text-sm font-bold text-green-600 animate-fade-in">
              {msg}
            </span>
          )}
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            <Save size={18} />
            {mutation.isPending ? "Salvando..." : "Salvar SEO"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* META TAGS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Search className="text-blue-900" size={20} />
            <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">
              Meta Tags (Buscadores)
            </h2>
          </div>
          <div className="space-y-4">
            <Field
              label="Título da página (Title)"
              hint="Aparece na aba do navegador e nos resultados do Google. Recomendado: até 60 caracteres."
            >
              <input
                value={form.seoTitle || ""}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder={form.siteName}
                className="input"
              />
              <Counter value={form.seoTitle || ""} max={60} />
            </Field>

            <Field
              label="Descrição (Meta description)"
              hint="Resumo que aparece nos resultados de busca. Recomendado: até 160 caracteres."
            >
              <textarea
                value={form.seoDescription || ""}
                onChange={(e) => set("seoDescription", e.target.value)}
                rows={3}
                className="input resize-none"
              />
              <Counter value={form.seoDescription || ""} max={160} />
            </Field>

            <Field label="Palavras-chave (Keywords)">
              <input
                value={form.seoKeywords || ""}
                onChange={(e) => set("seoKeywords", e.target.value)}
                placeholder="doces, festa, embalagens, balões..."
                className="input"
              />
            </Field>

            <Field label="Autor / Empresa">
              <input
                value={form.seoAuthor || ""}
                onChange={(e) => set("seoAuthor", e.target.value)}
                placeholder="Basmar Doces"
                className="input"
              />
            </Field>
          </div>
        </div>

        {/* OG / SOCIAL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Share2 className="text-blue-900" size={20} />
            <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">
              Compartilhamento Social (Open Graph)
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Imagem mostrada quando alguém compartilha o site no WhatsApp,
              Facebook, Instagram, etc. Tamanho ideal: 1200×630px.
            </p>
            <ImageUpload
              label="Imagem de Compartilhamento (OG Image)"
              value={form.seoOgImage || ""}
              onChange={(url) => set("seoOgImage", url)}
              aspectClass="aspect-[1200/630]"
              hint="1200x630px • paisagem (1.91:1) • redes sociais"
            />


            {form.seoOgImage && (
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Preview do Card Social
                </div>
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={form.seoOgImage}
                    alt="OG preview"
                    className="w-full aspect-[1200/630] object-cover"
                  />
                  <div className="p-3">
                    <div className="text-[10px] uppercase text-slate-400">
                      seusite.com.br
                    </div>
                    <div className="font-bold text-blue-900 text-sm line-clamp-1">
                      {form.seoTitle || form.siteName}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-2">
                      {form.seoDescription || "Adicione uma descrição..."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <BarChart3 className="text-blue-900" size={20} />
            <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">
              Rastreamento & Analytics
            </h2>
          </div>
          <div className="space-y-4">
            <Field
              label="Google Tag Manager (GTM)"
              hint="ID começa com GTM-XXXXXX"
            >
              <input
                value={form.gtmId || ""}
                onChange={(e) => set("gtmId", e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="input font-mono"
              />
            </Field>

            <Field
              label="Google Analytics (GA4)"
              hint="ID começa com G-XXXXXXX"
            >
              <input
                value={form.gaId || ""}
                onChange={(e) => set("gaId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="input font-mono"
              />
            </Field>

            <Field
              label="Facebook Pixel"
              hint="ID numérico do seu pixel do Facebook/Meta"
            >
              <input
                value={form.facebookPixelId || ""}
                onChange={(e) => set("facebookPixelId", e.target.value)}
                placeholder="123456789012345"
                className="input font-mono"
              />
            </Field>
          </div>
        </div>

        {/* CUSTOM CODE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Code2 className="text-blue-900" size={20} />
            <h2 className="font-black text-blue-900 uppercase tracking-wider text-sm">
              Códigos Personalizados
            </h2>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              Cole aqui qualquer script de rastreamento, verificação de domínio
              ou pixel adicional. Use tags <code>&lt;script&gt;</code> completas.
            </p>
          </div>

          <div className="space-y-4">
            <Field
              label="Código no <head>"
              hint="Verificação Google Search Console, Hotjar, Clarity, etc."
            >
              <textarea
                value={form.headCode || ""}
                onChange={(e) => set("headCode", e.target.value)}
                rows={8}
                placeholder='<meta name="google-site-verification" content="..." />\n<script>/* seu código */</script>'
                className="input font-mono text-xs resize-none"
              />
            </Field>

            <Field
              label="Código no <body>"
              hint="Chat widgets, scripts que rodam após o carregamento da página."
            >
              <textarea
                value={form.bodyCode || ""}
                onChange={(e) => set("bodyCode", e.target.value)}
                rows={8}
                placeholder="<script>/* chat, widgets, etc */</script>"
                className="input font-mono text-xs resize-none"
              />
            </Field>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { border-color: #1e3a8a; }
      `}</style>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-widest text-slate-500 block">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const over = len > max;
  return (
    <div
      className={`text-[10px] font-bold text-right ${over ? "text-red-600" : "text-slate-400"}`}
    >
      {len} / {max}
    </div>
  );
}
