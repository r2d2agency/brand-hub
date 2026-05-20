import { Outlet } from "react-router-dom";
import { Header, Footer, WhatsAppButton } from "@/components/SiteLayout";

export default function SiteLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
