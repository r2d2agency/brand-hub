import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function PageView() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["page", slug],
    queryFn: async () => (await api.get(`/pages/${slug}`)).data,
    enabled: !!slug,
  });

  if (isLoading) return <div className="p-8">Carregando…</div>;
  if (isError) return <div className="p-8">Página não encontrada. <Link to="/" className="underline">Voltar</Link></div>;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="text-sm text-slate-500">← Início</Link>
      <h1 className="mt-4 text-4xl font-bold">{data.title}</h1>
      <pre className="mt-8 whitespace-pre-wrap text-sm">{JSON.stringify(data.content, null, 2)}</pre>
    </article>
  );
}
