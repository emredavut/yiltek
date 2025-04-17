import React, { useState, useEffect } from "react";
import axios from "axios";
import SystemForm from "./SystemForm";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface System {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const SystemList: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSystems = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/systems`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSystems(response.data.systems);
    } catch (err) {
      setError("Sistemler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const handleAddClick = () => {
    setSelectedSystem(null);
    setShowForm(true);
  };

  const handleEditClick = (system: System) => {
    setSelectedSystem(system);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSystem(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSystem(null);
    fetchSystems();
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      await axios.delete(`${API_URL}/api/admin/systems/${confirmDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSystems(systems.filter((system) => system._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      setError("Sistem silinirken bir hata oluştu.");
    }
  };

  const filteredSystems = systems.filter(
    (system) =>
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && systems.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Sistemler</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Sistem ara..."
              className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Yeni Sistem Ekle
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-50 rounded-lg p-1">
          <SystemForm
            initialData={selectedSystem || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {filteredSystems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-md">
          {searchTerm ? (
            <p className="text-gray-500">
              Arama kriterlerine uygun sistem bulunamadı.
            </p>
          ) : (
            <p className="text-gray-500">Henüz sistem eklenmemiş.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSystems.map((system) => (
            <div
              key={system._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
            >
              <div
                className="h-48 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${system.imageUrl})` }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {system.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {system.description}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditClick(system)}
                    className="flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteClick(system._id)}
                    className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center mb-4 text-red-600">
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <h3 className="text-lg font-semibold">Silme Onayı</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Bu sistemi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemList;
