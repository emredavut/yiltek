import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout: React.FC = () => {
  const [username, setUsername] = useState<string>("Admin");
  const navigate = useNavigate();

  useEffect(() => {
    // Local storage'dan kullanıcı adını al (varsa)
    const storedUsername = localStorage.getItem("adminUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Çıkış işlemi
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Admin Navbar */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-3">
            <h2 className="text-xl font-semibold text-primary-600">
              Yiltek Admin Panel
            </h2>

            <div className="flex items-center space-x-3">
              <span className="text-gray-600">
                <span className="font-medium text-primary-600">{username}</span>
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </header>

        {/* Ana içerik */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
