import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, ChevronLeft, MessageCircle, Sparkles, X, ChevronRight, ZoomIn } from "lucide-react";

function getYoutubeEmbed(url: string) {
  if (!url) return "";
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function PegueMonteDetails() {
  const { slug } = useParams();
  const branding = useBranding();

  const { data: kit, isLoading, error } = useQuery({
    queryKey: ["site-pegue-monte", slug],
    queryFn: async () => (await api.get(`/site/pegue-monte/${slug}`)).data,
  });

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  const images: string[] = kit ? [kit.coverImage, ...(kit.gallery || [])].filter(Boolean) : [];

  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const nextImg = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);
  const prevImg = useCallback(() => {
    setLightboxIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, closeLightbox, nextImg, prevImg]);

  const handleWhatsApp = (phone?: string) => {
    const msg = encodeURIComponent(`Olá! Tenho interesse no kit Pegue e Monte: ${kit?.name}. Gostaria de mais informações.`);
    const targetPhone = (phone || branding?.whatsappPhone || "5511999999999").replace(/\D/g, "");
    window.open(`https://wa.me/${targetPhone}?text=${msg}`, "_blank");
    setShowStoreSelector(false);
  };

  const onWhatsAppClick = () => {
    if (kit?.storePhones && kit.storePhones.length > 1) {
      setShowStoreSelector(true);
    } else if (kit?.storePhones && kit.storePhones.length === 1) {
      handleWhatsApp(kit.storePhones[0].phone);
    } else {
      handleWhatsApp();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black text-blue-900 mb-3">Kit não encontrado</h1>
        <Link to="/pegue-monte" className="bg-blue-900 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
          Voltar
        </Link>
      </div>
    );
  }

  const embedUrl = kit.videoUrl ? getYoutubeEmbed(kit.videoUrl) : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/pegue-monte"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-blue-900 font-bold uppercase text-[10px] tracking-[0.2em] transition-all mb-6 hover:-translate-x-1"
          >
            <ChevronLeft size={12} />
            Coleções
          </Link>
        </motion.div>

        <div className="grid gap-8 md:gap-10 md:grid-cols-5 md:items-start">
          {/* Gallery — 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="md:col-span-3 space-y-3"
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(0)}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-lg shadow-blue-900/5 group cursor-zoom-in"
            >
              {kit.coverImage ? (
                <img
                  src={kit.coverImage}
                  alt={kit.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-900/10">
                  <PartyPopper size={64} />
                </div>
              )}

              {kit.theme && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-blue-900 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  {kit.theme}
                </div>
              )}

              <div className="absolute bottom-4 right-4 rounded-full bg-blue-900/80 backdrop-blur-md p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={14} />
              </div>
            </button>

            {kit.gallery && kit.gallery.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {kit.gallery.slice(0, 10).map((img: string, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLightboxIdx(idx + 1)}
                    className="aspect-square rounded-lg overflow-hidden bg-white border border-slate-100 hover:ring-2 ring-red-500/60 ring-offset-1 transition-all"
                  >
                    <img src={img} className="h-full w-full object-cover" alt={`foto ${idx + 1}`} />
                  </motion.button>
                ))}
              </div>
            )}

            {embedUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-lg"
              >
                <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Vídeo do kit" />
              </motion.div>
            )}
          </motion.div>

          {/* Info — 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="md:col-span-2 flex flex-col pt-1"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest mb-4 self-start">
              <Sparkles size={10} />
              Curadoria
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-blue-900 leading-[1.15] mb-3 tracking-tight">
              {kit.name}
            </h1>

            <div className="h-0.5 w-10 bg-red-600 rounded-full mb-5" />

            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {kit.description || "Uma composição harmônica para elevar o nível da sua celebração com sofisticação e praticidade."}
            </p>

            {kit.items && kit.items.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mb-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                <h3 className="text-[10px] font-black text-blue-900 mb-4 uppercase tracking-[0.2em]">
                  Composição
                </h3>
                <ul className="grid gap-2.5">
                  {kit.items.map((item: string, idx: number) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.04 }}
                      className="flex items-center gap-3 text-slate-600 text-xs"
                    >
                      <div className="h-1 w-1 rounded-full bg-red-500 flex-shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {(kit.partyType || kit.peopleCount || kit.unit) && (
              <div className="grid grid-cols-3 gap-2 mb-5">
                {kit.partyType && (
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Tipo</div>
                    <div className="text-xs font-bold text-blue-900 truncate">{kit.partyType}</div>
                  </div>
                )}
                {kit.peopleCount && (
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Pessoas</div>
                    <div className="text-xs font-bold text-blue-900 truncate">{kit.peopleCount}</div>
                  </div>
                )}
                {kit.unit && (
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Unidade</div>
                    <div className="text-xs font-bold text-blue-900 truncate">{kit.unit}</div>
                  </div>
                )}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 bg-blue-900 rounded-2xl p-5 text-white shadow-xl shadow-blue-900/15"
            >
              <div>
                <h4 className="text-blue-200 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Disponibilidade</h4>
                <p className="text-sm font-bold">Reserve para sua data</p>
              </div>

              <button
                onClick={onWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-black uppercase tracking-[0.1em] text-blue-900 hover:bg-red-600 hover:text-white transition-all active:scale-[0.97] group"
              >
                <MessageCircle size={14} className="group-hover:rotate-12 transition-transform" />
                WhatsApp
              </button>
            </motion.div>

            {kit.obs && (
              <p className="text-[11px] text-slate-400 italic mt-4 leading-relaxed">
                {kit.obs}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && images[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-5 right-5 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors z-10"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors z-10"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors z-10"
                  aria-label="Próxima"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold tracking-widest">
                  {lightboxIdx + 1} / {images.length}
                </div>
              </>
            )}

            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={images[lightboxIdx]}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
