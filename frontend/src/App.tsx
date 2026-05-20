import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PageView from "./pages/PageView";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import BrandingPage from "./pages/admin/Branding";
import PagesAdmin from "./pages/admin/Pages";
import ModulesAdmin from "./pages/admin/Modules";
import BannersAdmin from "./pages/admin/Banners";
import UsersAdmin from "./pages/admin/Users";
import StoresAdmin from "./pages/admin/Stores";
import CategoriesAdmin from "./pages/admin/Categories";
import Stores from "./pages/Stores";
import PromotionsAdmin from "./pages/admin/Promotions";
import NewsVideosAdmin from "./pages/admin/NewsVideos";
import HistoryAdmin from "./pages/admin/History";
import { ProtectedRoute } from "./lib/auth";
import PublicLayout from "./components/PublicLayout";

// Placeholder components for new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-4 border rounded bg-white">Gerenciamento de {title} (Em breve)</div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/p/:slug" element={<PageView />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Placeholder title="Contato" />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/pegue-monte" element={<Placeholder title="Pegue e Monte" />} />
        <Route path="/cursos" element={<Placeholder title="Cursos" />} />
        <Route path="/lojas" element={<Stores />} />
      </Route>

      <Route path="/login" element={<Login />} />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="branding" element={<BrandingPage />} />
        <Route path="pages" element={<PagesAdmin />} />
        <Route path="modules" element={<ModulesAdmin />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="banners" element={<BannersAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="stores" element={<StoresAdmin />} />
        <Route path="promotions" element={<PromotionsAdmin />} />
        <Route path="news-videos" element={<NewsVideosAdmin />} />
        <Route path="history" element={<HistoryAdmin />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="flex h-screen flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold text-blue-900">404</h1>
            <Link to="/" className="text-red-600 underline">
              Voltar
            </Link>
          </div>
        }
      />
    </Routes>
  );
}
