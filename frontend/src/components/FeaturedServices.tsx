import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, User, Play, X, Newspaper } from "lucide-react";
import { useBranding } from "@/lib/branding";

export default function FeaturedServices() {
  const branding = useBranding();
  const [activeVideo, setActiveVideo] = useState<any>(null);

  const { data: videos = [] } = useQuery({
    queryKey: ["site-news-videos-featured"],
    queryFn: async () => (await api.get("/site/news-videos")).data,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["site-courses-featured"],
    queryFn: async () => (await api.get("/site/courses")).data,
  });

  const featuredVideo = videos[0];
  const homeCourses = courses.filter((c: any) => c.active && c.showInHome);
  const featuredCourse = homeCourses[0] || courses[0];

  const getEmbedUrl = (url: string) => {
    try {
      let videoId = "";
      if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
      else if (url.includes("shorts/")) videoId = url.split("shorts/")[1].split("?")[0];
      else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch { return url; }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-6 md:py-10">
      <div className="grid gap-6 md:grid-cols-2">

        {/* COL 1: NOVIDADES */}
        <div className="relative group overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
          <button
            onClick={() => featuredVideo && setActiveVideo(featuredVideo)}
            className="block w-full text-left"
          >
            <div className="aspect-[16/10] md:aspect-auto md:h-[380px] relative overflow-hidden">
              {featuredVideo?.thumbnail ? (
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center">
                  <Newspaper size={40} className="text-blue-900/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />

              {featuredVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                    <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="mb-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Novidades
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-2 leading-tight">
                  {featuredVideo?.title || "Fique por dentro das novidades"}
                </h3>
                <p className="text-blue-100 font-medium mb-6 line-clamp-2 max-w-sm">
                  Dicas, lançamentos e os melhores momentos da Basmar para inspirar sua próxima festa.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* COL 2: CURSOS */}
        <div className="relative group overflow-hidden rounded-[3rem] bg-blue-900 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="aspect-[16/10] md:aspect-auto md:h-[380px] relative overflow-hidden">
            {featuredCourse?.coverImage ? (
              <img
                src={featuredCourse.coverImage}
                alt={featuredCourse.title}
                className="h-full w-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="h-full w-full bg-blue-800 flex items-center justify-center">
                <Calendar size={40} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Cursos e Workshops
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2 leading-tight">
                {featuredCourse?.title || "Aprenda Conosco"}
              </h3>

              <div className="space-y-2 mb-6 text-xs font-medium text-blue-100">
                {featuredCourse?.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-red-500" />
                    {new Date(featuredCourse.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </div>
                )}
                {featuredCourse?.instructor && (
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-red-500" />
                    {featuredCourse.instructor}
                  </div>
                )}
              </div>

              <Link
                to="/cursos"
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-red-600 hover:text-white transition-all w-fit"
              >
                Conhecer cursos
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
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
          <div className={`w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl ${activeVideo.orientation === 'vertical' ? 'max-w-sm aspect-[9/16]' : 'aspect-video'}`}>
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
