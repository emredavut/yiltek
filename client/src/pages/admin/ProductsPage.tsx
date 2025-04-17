import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import ProductForm from "../../components/admin/ProductForm";
import { Product, Category } from "../../types/product";
import { createAuthAxios } from "../../utils/axiosUtils";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    console.log("ProductsPage yükleniyor, veri çekilecek...");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const authAxios = createAuthAxios();

      const [productsResponse, categoriesResponse] = await Promise.all([
        authAxios.get("/products"),
        authAxios.get("/categories"),
      ]);

      console.log("API Yanıtı - Ürünler:", productsResponse.data);

      const productsData = Array.isArray(productsResponse.data)
        ? productsResponse.data
        : productsResponse.data.products || [];

      const categoriesData = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : categoriesResponse.data.categories || [];

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const authAxios = createAuthAxios();
        await authAxios.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        setError("Ürün silinirken bir hata oluştu.");
        console.error("Silme hatası:", err);
      }
    }
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);

      const authAxios = createAuthAxios();

      if (selectedProduct) {
        await authAxios.put(`/products/${selectedProduct._id}`, productData);
      } else {
        await authAxios.post("/products", productData);
      }

      await fetchData(); // Verileri yeniden yükle
      setShowForm(false);
      setSelectedProduct(null);
      setLoading(false);

      // İşlem başarılı olduğunu göster
      setError(null);
    } catch (err: any) {
      console.error("Product submit error:", err);
      setError(
        err.response?.data?.message || "Ürün kaydedilirken bir hata oluştu."
      );
      setLoading(false);
      // Hata varsa formu kapatmıyoruz, kullanıcı düzeltebilir
      return Promise.reject(err); // Hata olduğunu bildirmek için Promise.reject döndür
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? typeof product.category === "string"
        ? product.category === selectedCategory
        : product.category._id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ürün Yönetimi</h1>
          <p className="text-gray-500 mt-2">
            Ürünleri görüntüleyin, düzenleyin ve yönetin
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
              placeholder="Ürün ara..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setShowForm(true);
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-md font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-700 mb-3">
          Kategoriye Göre Filtrele
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              selectedCategory === null
                ? "bg-primary-600 text-white font-medium shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === category._id
                  ? "bg-primary-600 text-white font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 mb-8 rounded-md shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedProduct(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ProductForm
            product={selectedProduct}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Ürün bulunamadı
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || selectedCategory
              ? "Arama kriterlerine uygun ürün bulunamadı."
              : "Henüz ürün eklenmemiş."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Yeni Ürün Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                {product.mainImage ? (
                  <img
                    src={`${API_URL}${product.mainImage}`}
                    alt={product.name}
                    className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      console.log("Resim yüklenirken hata:", product.mainImage);
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                    Öne Çıkan
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                    {typeof product.category === "object"
                      ? product.category.name
                      : categories.find((c) => c._id === product.category)
                          ?.name || "Kategori"}
                  </span>
                </div>

                <div className="w-16 h-1 bg-gray-200 mb-3"></div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.isActive ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Pasif
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {product.gallery?.length || 0} Görsel
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    {product.accessories?.length || 0} Aksesuar
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      />
                    </svg>
                    {product.downloadFiles?.length || 0} Dosya
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors shadow-sm"
                    title="Düzenle"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors shadow-sm"
                    title="Sil"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
