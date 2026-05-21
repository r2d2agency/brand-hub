import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string) => void;
  label: string;
  aspectClass?: string;
  hint?: string; // ex.: "1920x720px • paisagem"
}


// Compress and convert file to base64 data URL
async function fileToCompressedDataURL(file: File, maxWidth = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ value, onChange, label, aspectClass = "aspect-[21/9]" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor envie apenas imagens.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert("Imagem muito grande. Máximo 15MB.");
      return;
    }
    setIsLoading(true);
    try {
      const dataUrl = await fileToCompressedDataURL(file);
      onChange(dataUrl);
    } catch (err) {
      alert("Erro ao processar imagem.");
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  // Paste handler (Ctrl+V)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            break;
          }
        }
      }
    };
    el.addEventListener("paste", handlePaste);
    return () => el.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          <LinkIcon size={12} />
          {showUrlInput ? "Fechar URL" : "Usar URL"}
        </button>
      </div>

      {showUrlInput && (
        <input
          type="url"
          placeholder="https://..."
          defaultValue={value?.startsWith("data:") ? "" : value || ""}
          onBlur={(e) => e.target.value && onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none"
        />
      )}

      <div
        ref={containerRef}
        tabIndex={0}
        onClick={() => !value && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`${aspectClass} relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-all cursor-pointer focus:outline-none ${
          isDragging 
            ? "border-red-500 bg-red-50 scale-[1.02]" 
            : value ? "border-transparent" : "border-slate-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-sm font-bold text-blue-900">Processando imagem...</div>
          </div>
        ) : value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/0 hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-900 hover:bg-blue-50"
              >
                Trocar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 flex items-center gap-1"
              >
                <X size={14} /> Remover
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-blue-100 p-4 mb-3">
              <Upload size={28} className="text-blue-900" />
            </div>
            <div className="text-sm font-bold text-slate-700">
              Arraste, cole (Ctrl+V) ou clique para enviar
            </div>
            <div className="text-xs text-slate-500 mt-1">
              JPG, PNG ou WEBP até 15MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
