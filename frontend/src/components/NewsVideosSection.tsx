import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Play, X } from "lucide-react";

export default function NewsVideosSection() {
  const [activeVideo, setActiveVideo] = useState<any>(null);

  const { data: videos = [] } = useQuery({
    queryKey: ["site-news-videos"],
    queryFn: async () => (await api.get("/site/news-videos")).data,
  });

  const getEmbedUrl = (url: string) => {
    try {
      let videoId = "";
      if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1].split("?")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch (e) {
      return url;
    }
  };

  if (videos.length === 0) return null;

  return (
    <section className="bg-blue-50 py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Momento Basmar</div>
          <h2 className="text-3xl md:text-4xl font-black text-blue-900">Dicas e Novidades</h2>
          <p className="mt-2 text-slate-500 font-medium">Fique por dentro do que há de novo e aprenda com nossos vídeos.</p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video: any) => (
            <div 
              key={video.id} 
              onClick={() => setActiveVideo(video)}
              className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 ${video.orientation === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'}`}
            >
              {/* Thumbnail */}
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {video.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="rounded-lg bg-red-600 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-all duration-300">
                  <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-xl">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors p-2 z-10"
          >
            <X size={40} strokeWidth={3} />
          </button>
          
          <div className={`w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl transition-all ${activeVideo.orientation === 'vertical' ? 'max-w-sm aspect-[9/16]' : 'aspect-video'}`}>
            <iframe 
              src={getEmbedUrl(activeVideo.youtubeUrl)}
              title={activeVideo.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
