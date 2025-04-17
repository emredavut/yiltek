import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Axios instance oluştur ve token'ı her istekte otomatik olarak ekle
const createAuthAxios = () => {
  const token = localStorage.getItem("adminToken");
  return axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

interface Category {
  _id?: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface CategoryFormProps {
  initialData?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // JWT token kontrolü
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[ğ]/g, "g")
        .replace(/[ü]/g, "u")
        .replace(/[ş]/g, "s")
        .replace(/[ı]/g, "i")
        .replace(/[ö]/g, "o")
        .replace(/[ç]/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  // Token yoklama ve yenileme işlemi
  const checkAndRefreshToken = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.log("Token bulunamadı. Giriş sayfasına yönlendiriliyor...");
      setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      setTimeout(() => navigate("/admin/login"), 2000);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Token kontrolü
    const isTokenValid = await checkAndRefreshToken();
    if (!isTokenValid) {
      setLoading(false);
      return;
    }

    try {
      // Formun slug alanının doğru formatta olduğundan emin olalım
      if (formData.name && !formData.slug) {
        const slug = formData.name
          .toLowerCase()
          .replace(/[ğ]/g, "g")
          .replace(/[ü]/g, "u")
          .replace(/[ş]/g, "s")
          .replace(/[ı]/g, "i")
          .replace(/[ö]/g, "o")
          .replace(/[ç]/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        formData.slug = slug;
      }

      const authAxios = createAuthAxios();

      console.log("Kategori verisi gönderiliyor:", formData);

      if (initialData?._id) {
        const response = await authAxios.put(
          `/categories/${initialData._id}`,
          formData
        );
        console.log("Kategori güncelleme yanıtı:", response.data);
      } else {
        const response = await authAxios.post("/categories", formData);
        console.log("Kategori ekleme yanıtı:", response.data);
      }

      onSuccess();
    } catch (err: any) {
      console.error("API hatası:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Yetkiniz yok veya oturum süresi dolmuş. Lütfen tekrar giriş yapın."
        );
        localStorage.removeItem("adminToken");
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          initialData?._id
            ? "Kategori güncellenirken bir hata oluştu"
            : "Kategori eklenirken bir hata oluştu"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Kategori Adı
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="isActive"
            className="block text-sm font-medium text-gray-700"
          >
            Durum
          </label>
          <select
            name="isActive"
            id="isActive"
            value={formData.isActive ? "true" : "false"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Kaydediliyor...
            </div>
          ) : initialData?._id ? (
            "Güncelle"
          ) : (
            "Kaydet"
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
