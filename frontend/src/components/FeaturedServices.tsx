import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, Calendar, User, MapPin } from "lucide-react";
import { useBranding } from "@/lib/branding";

export default function FeaturedServices() {
  const branding = useBranding();
  
  const { data: kits = [] } = useQuery({
    queryKey: ["site-pegue-monte-featured"],
    queryFn: async () => (await api.get("/site/pegue-monte")).data,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["site-courses-featured"],
    queryFn: async () => (await api.get("/site/courses")).data,
  });

  const featuredKit = kits.find((k: any) => k.highlight) || kits[0];
  const homeCourses = courses.filter((c: any) => c.active && c.showInHome);
  const featuredCourse = homeCourses[0] || courses[0];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
      <div className="grid gap-8 md:grid-cols-2">
        
        {/* COL 1: PEGUE E MONTE */}
        <div className="relative group overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="aspect-[16/10] md:aspect-auto md:h-[450px] relative overflow-hidden">
            {featuredKit?.coverImage ? (
              <img 
                src={featuredKit.coverImage} 
                alt={featuredKit.name} 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center">
                <Sparkles size={40} className="text-blue-900/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Pegue e Monte
                </span>
              </div>
              <h3 className="text-3xl font-black mb-3 leading-tight">
                {featuredKit?.name || "Kits de Festa Prontos"}
              </h3>
              <p className="text-blue-100 font-medium mb-6 line-clamp-2 max-w-sm">
                {featuredKit?.description || "Alugue kits completos para sua festa e monte você mesmo com praticidade e economia."}
              </p>
              <Link 
                to="/pegue-monte"
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-red-600 hover:text-white transition-all w-fit"
              >
                Ver todos os kits
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* COL 2: CURSOS */}
        <div className="relative group overflow-hidden rounded-[3rem] bg-blue-900 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="aspect-[16/10] md:aspect-auto md:h-[450px] relative overflow-hidden">
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
              <h3 className="text-3xl font-black mb-3 leading-tight">
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
    </section>
  );
}
