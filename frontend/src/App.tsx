import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PageView from "./pages/PageView";
import About from "./pages/About";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import BrandingPage from "./pages/admin/Branding";
import PagesAdmin from "./pages/admin/Pages";
import ModulesAdmin from "./pages/admin/Modules";
import UsersAdmin from "./pages/admin/Users";
import { ProtectedRoute } from "./lib/auth";

// Placeholder components for new routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-4 border rounded bg-white">Gerenciamento de {title} (Em breve)</div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/p/:slug" element={<PageView />} />
      <Route path="/sobre" element={<About />} />
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
        <Route path="banners" element={<Placeholder title="Banners" />} />
        <Route path="categories" element={<Placeholder title="Categorias" />} />
        <Route path="stores" element={<Placeholder title="Lojas" />} />
        <Route path="history" element={<Placeholder title="História" />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="flex h-screen flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold">404</h1>
            <Link to="/" className="text-blue-600 underline">
              Voltar
            </Link>
          </div>
        }
      />
    </Routes>
  );
}
