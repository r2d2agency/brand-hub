import { Outlet } from "react-router-dom";
import { Header, Footer, WhatsAppButton } from "@/components/SiteLayout";
import SeoInjector from "@/components/SeoInjector";

export default function SiteLayout() {
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
