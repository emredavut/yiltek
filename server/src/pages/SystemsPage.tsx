import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface System {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const SystemsPage: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/systems/public`);
      setSystems(response.data.systems || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Sistemler yüklenirken bir hata oluştu");
      setLoading(false);
    }
  };

  const handleQuoteRequest = (systemName: string) => {
    navigate(`/iletisim?system=${encodeURIComponent(systemName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30 opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sistemlerimiz
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Yılların deneyimi ile geliştirdiğimiz araç üstü ekipman otomasyon
              sistemlerimiz, sektörde fark yaratacak çözümler sunuyor.
            </p>
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map((system, index) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={system.imageUrl}
                  alt={system.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {system.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleQuoteRequest(system.name)}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg mt-auto"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Teklif İste
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemsPage;
