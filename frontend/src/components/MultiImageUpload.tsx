import { useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface MultiImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
}

export default function MultiImageUpload({ value = [], onChange, label }: MultiImageUploadProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addImage = (url: string) => {
    onChange([...value, url]);
    setIsAdding(false);
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            <img src={url} alt={`Item ${index + 1}`} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="rounded-lg bg-white p-2 text-red-600 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}

        {isAdding ? (
          <div className="aspect-square">
            <ImageUpload
              label="Nova Foto"
              value=""
              onChange={addImage}
              aspectClass="aspect-square"
            />
            <button 
              type="button"
              onClick={() => setIsAdding(false)}
              className="mt-2 w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-blue-900 hover:bg-blue-50 hover:text-blue-900 transition-all"
          >
            <Plus size={24} />
            <span className="mt-2 text-[10px] font-black uppercase tracking-widest">Adicionar Foto</span>
          </button>
        )}
      </div>
    </div>
  );
}
