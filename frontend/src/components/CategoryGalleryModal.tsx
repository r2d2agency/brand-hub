import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryGalleryModalProps {
  category: any;
  onClose: () => void;
}

export default function CategoryGalleryModal({ category, onClose }: CategoryGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gallery = [category.coverImage, ...(category.gallery || [])].filter(Boolean);

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(category.whatsappMsg || `Olá! Gostaria de saber mais sobre ${category.name}.`);
    window.open(`https://wa.me/5511999999999?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/95 backdrop-blur-md">
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X size={24} />
      </motion.button>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:items-center">
        
        {/* Main Image View */}
        <div className="flex-1 relative aspect-square lg:aspect-video rounded-3xl overflow-hidden bg-slate-900 group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={gallery[currentIndex]}
              alt={category.name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full object-contain lg:object-cover"
            />
          </AnimatePresence>

          {gallery.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:w-96 text-white space-y-6">
          <div className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
            Vitrine Especial
          </div>
          
          <div>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight">{category.name}</h2>
            <div className="mt-4 h-1 w-20 bg-red-600 rounded-full" />
          </div>

          <p className="text-blue-100/80 text-lg leading-relaxed font-medium">
            {category.description || "Descubra nossa variedade completa de itens selecionados para sua festa."}
          </p>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <button 
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-green-500 py-5 text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
            >
              <MessageCircle size={22} />
              Pedir Orçamento
            </button>
            <p className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest italic">
              * Atendimento personalizado via WhatsApp
            </p>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-white/10">
              {gallery.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-red-600 scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={url} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
