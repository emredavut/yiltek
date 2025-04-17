import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(!!token);
  }, []);

  // Yükleniyor durumu, boş sayfa gösteriliyor
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Eğer token yoksa, login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Token varsa, devam et
  return <Outlet />;
};

export default ProtectedRoute;
