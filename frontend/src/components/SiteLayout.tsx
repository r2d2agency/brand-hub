import { Link } from "react-router-dom";
import { MessageCircle, Menu, X, Instagram, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { useBranding } from "@/lib/branding";
import logoBasmar from "@/assets/logo-basmar.png";

export function Header() {
  const branding = useBranding();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/sobre", label: "Sobre" },
    { to: "/categorias", label: "Categorias" },
    { to: "/pegue-monte", label: "Pegue e Monte" },
    { to: "/cursos", label: "Cursos" },
    { to: "/lojas", label: "Lojas" },
    { to: "/contato", label: "Contato" },
  ];

  return (
    <header 
      className="sticky top-0 z-50 border-b-4 bg-white shadow-sm"
      style={{ borderBottomColor: branding?.primaryColor || '#dc2626' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center shrink-0">
          <img src={branding?.logoUrl || logoBasmar} alt={branding?.siteName || "Basmar"} className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wide text-blue-900">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-red-600 transition-colors">
              {link.label}
            </Link>
          ))}
          <Link to="/admin" className="rounded-full bg-blue-900 px-4 py-2 text-xs text-white hover:bg-blue-800 transition-colors">
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-blue-900" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-slate-100 bg-white p-6 flex flex-col gap-4 text-center font-bold uppercase tracking-wide text-blue-900">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-slate-50 hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/admin" 
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 rounded-full bg-blue-900 py-3 text-white"
          >
            Admin
          </Link>
        </nav>
      )}
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
              <Link to="/contato" className="hover:opacity-100 transition-colors">Contato</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase text-xs tracking-widest" style={{ color: branding?.primaryColor || '#ef4444' }}>Redes Sociais</h4>
            <div className="flex gap-4">
              {branding?.instagramUrl && (
                <a href={branding.instagramUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-red-600" style={{ backgroundColor: branding.primaryColor || '#1e3a8a' }}>
                  <Instagram size={20} />
                </a>
              )}
              {branding?.facebookUrl && (
                <a href={branding.facebookUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-red-600" style={{ backgroundColor: branding.primaryColor || '#1e3a8a' }}>
                  <Facebook size={20} />
                </a>
              )}
              {branding?.youtubeUrl && (
                <a href={branding.youtubeUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-red-600" style={{ backgroundColor: branding.primaryColor || '#1e3a8a' }}>
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
  return (
    <a 
      href="https://wa.me/5511999999999" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl shadow-green-500/40 hover:scale-110 transition-transform"
    >
      <MessageCircle size={32} />
    </a>
  );
}
