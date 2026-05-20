import { useState, useRef, useCallback } from "react";
import { Upload, X, Plus, Link as LinkIcon, GripVertical } from "lucide-react";

interface GalleryUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  max?: number;
}

async function fileToCompressedDataURL(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
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

export default function GalleryUpload({ value, onChange, label = "Galeria", max = 20 }: GalleryUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const items = value || [];

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!arr.length) return;
    setIsLoading(true);
    try {
      const dataUrls: string[] = [];
      for (const f of arr) {
        if (f.size > 15 * 1024 * 1024) continue;
        dataUrls.push(await fileToCompressedDataURL(f));
      }
      const next = [...items, ...dataUrls].slice(0, max);
      onChange(next);
    } finally {
      setIsLoading(false);
    }
  }, [items, max, onChange]);

  const removeAt = (i: number) => {
    const next = items.filter((_, idx) => idx !== i);
    onChange(next);
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-widest text-slate-500">
          {label} <span className="text-slate-400 font-normal normal-case tracking-normal">({items.length}/{max})</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrl(!showUrl)}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          <LinkIcon size={12} />
          {showUrl ? "Fechar URL" : "Adicionar por URL"}
        </button>
      </div>

      {showUrl && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (urlValue.trim()) {
                onChange([...items, urlValue.trim()].slice(0, max));
                setUrlValue("");
              }
            }}
            className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
          >
            Adicionar
          </button>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-3 transition-all ${
          isDragging ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {items.length === 0 && !isLoading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center py-8 text-center"
          >
            <div className="rounded-full bg-blue-100 p-3 mb-2">
              <Upload size={20} className="text-blue-900" />
            </div>
            <div className="text-sm font-bold text-slate-700">
              Arraste várias imagens ou clique para selecionar
            </div>
            <div className="text-xs text-slate-500 mt-1">
              JPG, PNG ou WEBP — até {max} fotos
            </div>
          </button>
        )}

        {(items.length > 0 || isLoading) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {items.map((src, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => { dragIndex.current = i; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (dragIndex.current !== null) reorder(dragIndex.current, i);
                  dragIndex.current = null;
                }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white cursor-move"
              >
                <img src={src} alt={`gallery-${i}`} className="h-full w-full object-cover" />
                <div className="absolute top-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {i + 1}
                </div>
                <div className="absolute top-1 right-1 rounded bg-black/40 p-1 text-white opacity-0 group-hover:opacity-100">
                  <GripVertical size={12} />
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute bottom-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 hover:bg-red-700"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {items.length < max && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-700"
              >
                <Plus size={20} />
                <span className="text-[10px] font-bold mt-1">Adicionar</span>
              </button>
            )}

            {isLoading && (
              <div className="aspect-square rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-900">
                Processando...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
