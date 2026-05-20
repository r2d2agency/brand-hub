import { Outlet } from "react-router-dom";
import { Header, Footer, WhatsAppButton } from "@/components/SiteLayout";
import SeoInjector from "@/components/SeoInjector";
import { usePageTracker } from "@/lib/usePageTracker";

export default function SiteLayout() {
  usePageTracker();
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <SeoInjector />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
