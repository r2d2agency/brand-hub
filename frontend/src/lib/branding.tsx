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
