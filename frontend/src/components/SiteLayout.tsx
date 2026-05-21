import { Link } from "react-router-dom";
import { MessageCircle, Menu, X, Instagram, Facebook, Youtube, Search } from "lucide-react";
import { useState } from "react";
import { useBranding } from "@/lib/branding";
import logoBasmar from "@/assets/logo-basmar.png";
import CategoryMenuBar from "@/components/CategoryMenuBar";
import SearchOverlay from "@/components/SearchOverlay";

export function Header() {
  const branding = useBranding();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/sobre", label: "Sobre" },
    { to: "/categorias", label: "Categorias" },
    { to: "/pegue-monte", label: "Pegue e Monte" },
    { to: "/cursos", label: "Cursos" },
    { to: "/lojas", label: "Lojas" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src={branding?.logoUrl || logoBasmar} alt={branding?.siteName || "Basmar"} className="h-12 md:h-14 w-auto object-contain" />
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex flex-1 max-w-2xl items-center gap-3 px-5 py-3 rounded-full border border-slate-200 hover:border-red-400 text-left text-slate-400 transition-colors"
          >
            <Search size={18} />
            <span className="text-sm">O que você está procurando?</span>
            <span className="ml-auto px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: branding?.primaryColor || '#dc2626' }}><Search size={14} /></span>
          </button>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <button onClick={() => setSearchOpen(true)} className="md:hidden p-2 text-blue-900"><Search size={22} /></button>
            <Link to="/admin" className="hidden lg:inline-flex rounded-full bg-blue-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors">
              Painel
            </Link>
            <button className="lg:hidden p-2 text-blue-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <CategoryMenuBar />

      {isMenuOpen && (
        <nav className="lg:hidden border-t border-slate-100 bg-white p-6 flex flex-col gap-4 text-center font-bold uppercase tracking-wide text-blue-900">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-red-600">
              {link.label}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="mt-2 rounded-full bg-blue-900 py-3 text-white">
            Painel
          </Link>
        </nav>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

export function Footer() {
  const branding = useBranding();
  
  return (
    <footer 
      className="py-16 md:py-20 text-white border-t-4"
      style={{ 
        backgroundColor: branding?.footerBgColor || '#0f172a',
        color: branding?.footerTextColor || '#ffffff',
        borderTopColor: branding?.primaryColor || '#dc2626'
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="col-span-2">
            <img 
              src={branding?.footerLogo || branding?.logoUrl || logoBasmar} 
              alt={branding?.siteName || "Basmar"} 
              className="h-16 w-auto object-contain bg-white/5 rounded-lg p-2 inline-block mb-6" 
            />
            <p className="max-w-sm font-medium opacity-80">
              {branding?.footerText || "Sua parceira ideal para transformar qualquer comemoração em um momento mágico. Desde o doce até a decoração, estamos com você desde 1991."}
            </p>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase text-xs tracking-widest" style={{ color: branding?.primaryColor || '#ef4444' }}>Navegue</h4>
            <nav className="flex flex-col gap-3 opacity-80">
              <Link to="/sobre" className="hover:opacity-100 transition-colors">Sobre Nós</Link>
              <Link to="/lojas" className="hover:opacity-100 transition-colors">Onde Estamos</Link>
              <Link to="/cursos" className="hover:opacity-100 transition-colors">Cursos</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase text-xs tracking-widest" style={{ color: branding?.primaryColor || '#ef4444' }}>Redes Sociais</h4>
            <div className="flex gap-4">
              {branding?.instagramUrl && (
                <a href={branding.instagramUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg" style={{ backgroundColor: branding.instagramColor || '#1e3a8a' }}>
                  <Instagram size={20} />
                </a>
              )}
              {branding?.facebookUrl && (
                <a href={branding.facebookUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg" style={{ backgroundColor: branding.facebookColor || '#1e3a8a' }}>
                  <Facebook size={20} />
                </a>
              )}
              {branding?.youtubeUrl && (
                <a href={branding.youtubeUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg" style={{ backgroundColor: branding.youtubeColor || '#1e3a8a' }}>
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}>
          <div>
            © {new Date().getFullYear()} {branding?.siteName || "Basmar Doces"}. Todos os direitos reservados.
          </div>
          <div className="font-bold tracking-wider text-xs uppercase">
            Design by <span style={{ color: branding?.primaryColor || '#ef4444' }}>TNS R2D2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  const branding = useBranding();
  
  if (!branding?.whatsappPhone) return null;

  return (
    <a 
      href={`https://wa.me/${branding.whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(branding.whatsappMessage || '')}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform bg-green-500"
    >
      <MessageCircle size={32} />
    </a>
  );
}
