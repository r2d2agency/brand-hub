import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Branding } from "@/lib/branding";

const fields: { key: keyof Branding; label: string; type?: string }[] = [
  { key: "siteName", label: "Nome do site" },
  { key: "tagline", label: "Tagline" },
  { key: "logoUrl", label: "URL do logo" },
  { key: "faviconUrl", label: "URL do favicon" },
  { key: "primaryColor", label: "Cor primária", type: "color" },
  { key: "secondaryColor", label: "Cor secundária", type: "color" },
  { key: "accentColor", label: "Cor de destaque", type: "color" },
  { key: "backgroundColor", label: "Cor de fundo", type: "color" },
  { key: "foregroundColor", label: "Cor do texto", type: "color" },
  { key: "fontHeading", label: "Fonte títulos" },
  { key: "fontBody", label: "Fonte corpo" },
];

export default function BrandingAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery<Branding>({
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
      setMsg("Salvo!");
      setTimeout(() => setMsg(""), 2000);
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Branding</h1>
      <p className="mt-1 text-sm text-slate-500">Identidade visual do site.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
        className="mt-6 grid gap-4"
      >
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm font-medium">{f.label}</span>
            <input
              type={f.type ?? "text"}
              value={(form[f.key] as string) ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </label>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            {mutation.isPending ? "Salvando…" : "Salvar"}
          </button>
          {msg && <span className="text-sm text-green-600">{msg}</span>}
        </div>
      </form>
    </div>
  );
}
