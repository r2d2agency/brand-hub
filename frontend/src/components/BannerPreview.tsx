import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MessageCircle, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

interface BannerPreviewProps {
  title: string;
  subtitle?: string;
  imageDesktop: string;
  imageMobile?: string;
  buttonText?: string;
  fontFamily?: string;
  fontSize?: string;
}

export default function BannerPreview({
  title,
  subtitle,
  imageDesktop,
  imageMobile,
  buttonText,
  fontFamily = "Inter",
  fontSize = "text-4xl md:text-6xl lg:text-8xl",
}: BannerPreviewProps) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">Pré-visualização em Tempo Real</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setView("desktop")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              view === "desktop" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Monitor size={14} /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setView("mobile")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              view === "mobile" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>
      </div>

      <div className={`relative overflow-hidden bg-slate-900 transition-all duration-500 mx-auto ${
        view === "desktop" ? "aspect-[21/9] w-full rounded-xl" : "aspect-[9/16] w-[280px] rounded-[32px] border-[8px] border-slate-800"
      }`}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={(view === "mobile" && imageMobile) ? imageMobile : imageDesktop} 
            alt="Preview" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/40 to-transparent" />
        </div>

        {/* Content */}
        <div className={`relative h-full w-full flex items-center px-6 ${view === "mobile" ? "text-center" : ""}`}>
          <div className={`w-full ${view === "desktop" ? "max-w-xl" : "max-w-full"}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={`${title}-${view}`}
              className={`inline-block rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white mb-4`}
            >
              Basmar Doces
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              key={`${title}-h2-${view}`}
              className={`font-black leading-tight text-white mb-4 ${view === "desktop" ? fontSize : "text-2xl"}`}
              style={{ fontFamily }}
            >
              {title || "Título do Banner"}
            </motion.h2>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                key={`${subtitle}-p-${view}`}
                className={`font-medium text-blue-100 mb-6 ${view === "desktop" ? "text-lg" : "text-sm line-clamp-3"}`}
              >
                {subtitle}
              </motion.p>
            )}

            {buttonText && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                key={`${buttonText}-btn-${view}`}
                className={`flex flex-wrap gap-2 ${view === "mobile" ? "justify-center" : ""}`}
              >
                <div className={`rounded-full bg-red-600 font-bold text-white flex items-center gap-1 shadow-lg ${
                  view === "desktop" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs"
                }`}>
                  {buttonText}
                  <ChevronRight size={view === "desktop" ? 18 : 14} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-center text-slate-400 italic">
        * A pré-visualização é uma simulação e pode variar ligeiramente no site real devido a fontes e resoluções.
      </p>
    </div>
  );
}
