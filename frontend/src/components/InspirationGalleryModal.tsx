import { X, ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InspirationGalleryModalProps {
  inspiration: any;
  onClose: () => void;
}

export default function InspirationGalleryModal({ inspiration, onClose }: InspirationGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gallery = [inspiration.image, ...(inspiration.gallery || [])].filter(Boolean);

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X size={24} />
      </motion.button>

      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* Main Image View */}
        <div className="relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden bg-slate-900 group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={gallery[currentIndex]}
              alt={inspiration.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full object-contain"
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

        {/* Info Area */}
        <div className="text-white text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-black">{inspiration.title}</h2>
          
          {inspiration.link && (
            <a 
              href={inspiration.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              <LinkIcon size={16} />
              Ver mais detalhes
            </a>
          )}

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {gallery.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-red-600 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
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
