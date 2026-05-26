import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useBranding } from "@/lib/branding";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  User,
  MapPin,
  Clock,
  MessageCircle,
  X,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function CoursesPage() {
  const branding = useBranding();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [filter, setFilter] = useState<"ALL" | "SOON" | "OPEN" | "CLOSED">("ALL");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["site-courses"],
    queryFn: async () => (await api.get("/site/courses")).data,
  });

  const filtered = courses.filter((c: any) => {
    const now = new Date();
    const start = c.registrationStart ? new Date(c.registrationStart) : null;
    const end = c.registrationEnd ? new Date(c.registrationEnd) : null;
    
    // Auto status
    let status = c.status;
    if (start && end) {
      if (now < start) status = "SOON";
      else if (now >= start && now <= end) status = "OPEN";
      else status = "CLOSED";
    }

    if (filter === "ALL") return c.active;
    return c.active && status === filter;
  });

  const statusLabel: Record<string, string> = {
    SOON: "Em breve",
    OPEN: "Inscrições abertas",
    CLOSED: "Encerrado",
  };

  const statusColor: Record<string, string> = {
    SOON: "bg-amber-500",
    OPEN: "bg-green-500",
    CLOSED: "bg-slate-500",
  };

  const groupByMonth = (items: any[]) => {
    const groups: Record<string, any[]> = {};
    items.forEach((item) => {
      const date = item.date ? new Date(item.date) : null;
      const key = date
        ? date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        : "Data a definir";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const grouped = groupByMonth(filtered);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red-500 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              {branding?.siteName || "Basmar"} Academy
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Cursos & <span className="text-red-400">Workshops</span>
            </h1>
            <p className="max-w-xl mx-auto text-blue-100 font-medium text-sm md:text-base leading-relaxed">
              {branding?.coursesIntro ||
                "Aprenda com quem entende do assunto: workshops, oficinas e cursos para todos os níveis."}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {(["ALL", "SOON", "OPEN", "CLOSED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-white text-blue-900 shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {f === "ALL" ? "Todos" : statusLabel[f]}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses List */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Nenhum curso encontrado
            </p>
          </motion.div>
        ) : (
          <div className="space-y-16">
            {Object.entries(grouped).map(([month, items], gi) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: gi * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-black text-blue-900 capitalize">
                    {month}
                  </h2>
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {items.length} curso{items.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((course: any, i: number) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {/* Cover */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            course.coverImage ||
                            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
                          }
                          alt={course.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`${statusColor[course.status || "SOON"]} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}
                          >
                            {statusLabel[course.status || "SOON"]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-black text-blue-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {course.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                          {course.date && (
                            <div className="flex items-center gap-2">
                              <Calendar size={13} className="text-red-500" />
                              {new Date(course.date).toLocaleDateString(
                                "pt-BR",
                                {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                }
                              )}
                              {course.time && (
                                <span className="text-slate-400">
                                  • {course.time}
                                </span>
                              )}
                            </div>
                          )}
                          {course.instructor && (
                            <div className="flex items-center gap-2">
                              <User size={13} className="text-red-500" />
                              {course.instructor}
                            </div>
                          )}
                          {course.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={13} className="text-red-500" />
                              {course.location}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-900 group-hover:text-red-600 transition-colors">
                          Ver detalhes
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Strip */}
      <section
        className="py-12 text-white"
        style={{ backgroundColor: branding?.primaryColor || "#dc2626" }}
      >
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl md:text-2xl font-black">
              Quer sugerir um curso?
            </h3>
            <p className="mt-1 font-medium opacity-90 text-sm">
              Fale conosco pelo WhatsApp e conte o que gostaria de aprender.
            </p>
          </div>
          <a
            href={`https://wa.me/${branding?.whatsappPhone?.replace(/\D/g, "") || "5511999999999"}?text=${encodeURIComponent("Olá! Gostaria de sugerir um curso...")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 font-bold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ color: branding?.primaryColor || "#dc2626" }}
          >
            <MessageCircle size={18} />
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-blue-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/90 text-slate-500 hover:bg-red-600 hover:text-white transition-colors shadow-lg"
              >
                <X size={18} />
              </button>

              {/* Cover */}
              <div className="relative h-64 md:h-80">
                <img
                  src={
                    selectedCourse.coverImage ||
                    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt={selectedCourse.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span
                    className={`inline-block ${statusColor[selectedCourse.status || "SOON"]} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3`}
                  >
                    {statusLabel[selectedCourse.status || "SOON"]}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {selectedCourse.title}
                  </h2>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 md:p-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                  {selectedCourse.date && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                      <Calendar size={20} className="text-red-500" />
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Data
                        </div>
                        <div className="text-sm font-bold text-blue-900">
                          {new Date(selectedCourse.date).toLocaleDateString(
                            "pt-BR",
                            {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCourse.time && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                      <Clock size={20} className="text-red-500" />
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Horário
                        </div>
                        <div className="text-sm font-bold text-blue-900">
                          {selectedCourse.time}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCourse.instructor && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                      <User size={20} className="text-red-500" />
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Instrutor
                        </div>
                        <div className="text-sm font-bold text-blue-900">
                          {selectedCourse.instructor}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCourse.location && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                      <MapPin size={20} className="text-red-500" />
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Local
                        </div>
                        <div className="text-sm font-bold text-blue-900">
                          {selectedCourse.location}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedCourse.description && (
                  <div className="mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                      Sobre o curso
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed text-sm">
                      {selectedCourse.description}
                    </p>
                  </div>
                )}

                {/* Gallery */}
                {selectedCourse.gallery &&
                  selectedCourse.gallery.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                        Galeria
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedCourse.gallery.map((img: string, i: number) => (
                          <img
                            key={i}
                            src={img}
                            alt={`${selectedCourse.title} ${i + 1}`}
                            className="h-28 w-full object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* CTA */}
                <a
                  href={`https://wa.me/${branding?.whatsappPhone?.replace(/\D/g, "") || "5511999999999"}?text=${encodeURIComponent(
                    selectedCourse.whatsappMsg ||
                      `Olá! Tenho interesse no curso: ${selectedCourse.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-green-500 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
                >
                  <MessageCircle size={20} />
                  Quero me inscrever
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
