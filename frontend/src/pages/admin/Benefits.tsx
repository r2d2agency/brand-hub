import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Trash2, Save } from "lucide-react";

export default function BenefitsAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<any[]>({
    queryKey: ["admin-benefits"],
    queryFn: async () => (await api.get("/admin-cms/benefits")).data,
  });
  const [form, setForm] = useState({ icon: "ShieldCheck", title: "", subtitle: "" });

  const create = useMutation({
    mutationFn: async () => (await api.post("/admin-cms/benefits", { ...form, order: data.length })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-benefits"] }); setForm({ icon: "ShieldCheck", title: "", subtitle: "" }); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin-cms/benefits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-benefits"] }),
  });
  const toggle = useMutation({
    mutationFn: async (b: any) => api.put(`/admin-cms/benefits/${b.id}`, { active: !b.active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-benefits"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Benefícios (Rodapé)</h1>
        <p className="mt-1 text-sm text-slate-500">Itens da barra de benefícios exibida acima do rodapé (segurança, entrega, parcelamento, etc).</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
        className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4"
      >
        <input required placeholder="Ícone Lucide (ex: ShieldCheck)" value={form.icon} onChange={e => setForm(s => ({ ...s, icon: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required placeholder="Título" value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Subtítulo (opcional)" value={form.subtitle} onChange={e => setForm(s => ({ ...s, subtitle: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <button className="rounded-md bg-blue-900 px-4 py-2 text-sm font-bold text-white flex items-center justify-center gap-2"><Plus size={16}/> Adicionar</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {data.map((b: any) => (
          <div key={b.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">{b.icon}</div>
              <div className="font-bold text-blue-900">{b.title}</div>
              {b.subtitle && <div className="text-xs text-slate-500">{b.subtitle}</div>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle.mutate(b)} className={`rounded-full px-3 py-1 text-xs ${b.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{b.active ? 'Ativo' : 'Inativo'}</button>
              <button onClick={() => confirm("Excluir?") && remove.mutate(b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-slate-400 text-sm">Nenhum benefício cadastrado.</p>}
      </div>
    </div>
  );
}
