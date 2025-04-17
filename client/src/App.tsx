import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/common/WhatsAppButton";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import SystemsPage from "./pages/SystemsPage";
import ReferencesPage from "./pages/ReferencesPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminSystemsPage from "./pages/admin/SystemsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import GalleryAdminPage from "./pages/admin/GalleryPage";
import LoginPage from "./pages/admin/LoginPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import AdminProductsPage from "./pages/admin/ProductsPage";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ProductDebug from "./pages/ProductDebug";
import ServicePage from "./pages/ServicePage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <HomePage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/urunler"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <ProductsPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/urun/:slug"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <ProductDetailPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Korumalı Admin Rotaları */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/systems" replace />} />
            <Route path="systems" element={<AdminSystemsPage />} />
            <Route path="gallery" element={<GalleryAdminPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>
        </Route>

        <Route
          path="/kurumsal"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <AboutPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/urunler/kategori/:slug"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <CategoryPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/urunler/:slug"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <ProductDetailPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/sistemler"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <SystemsPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/galeri"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <GalleryPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/referanslar"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <ReferencesPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/servis"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <ServicePage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route
          path="/iletisim"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <ContactPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
        <Route path="/debug/products" element={<ProductDebug />} />
        <Route
          path="*"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <NotFoundPage />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
