import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export interface Branding {
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  fontHeading: string;
  fontBody: string;
  // Footer & Social
  footerText: string | null;
  footerLogo: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  instagramColor: string;
  facebookColor: string;
  youtubeColor: string;
  // WhatsApp Floating
  whatsappPhone: string | null;
  whatsappMessage: string | null;
  // UI Colors
  footerBgColor: string;
  footerTextColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  coursesIntro?: string | null;
}

const BrandingContext = createContext<Branding | null>(null);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery<Branding>({
    queryKey: ["branding"],
    queryFn: async () => (await api.get("/branding")).data,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!data) return;
    const r = document.documentElement.style;
    r.setProperty("--color-primary", data.primaryColor);
    r.setProperty("--color-secondary", data.secondaryColor);
    r.setProperty("--color-accent", data.accentColor);
    r.setProperty("--color-bg", data.backgroundColor);
    r.setProperty("--color-fg", data.foregroundColor);
    r.setProperty("--font-heading", `"${data.fontHeading}", system-ui, sans-serif`);
    r.setProperty("--font-body", `"${data.fontBody}", system-ui, sans-serif`);
    
    // Google Fonts Loader
    const fontsToLoad = [data.fontHeading, data.fontBody].filter(Boolean);
    const linkId = 'google-fonts-branding';
    let fontLink = document.getElementById(linkId) as HTMLLinkElement;
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = linkId;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    const fontQuery = fontsToLoad.map(f => `family=${f.replace(/\s+/g, '+')}:wght@400;700;900`).join('&');
    fontLink.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    
    // UI Theme variables
    r.setProperty("--footer-bg", data.footerBgColor);
    r.setProperty("--footer-text", data.footerTextColor);
    r.setProperty("--btn-bg", data.buttonBgColor);
    r.setProperty("--btn-text", data.buttonTextColor);
    
    document.title = data.siteName;
    if (data.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = data.faviconUrl;
    }
  }, [data]);

  return <BrandingContext.Provider value={data ?? null}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}
