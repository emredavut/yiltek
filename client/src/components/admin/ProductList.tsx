import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";
import { Product, Category } from "../../types/product";
import { createAuthAxios } from "../../utils/axiosUtils";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const convertToFormProduct = (product: Product): Product => {
    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      category:
        typeof product.category === "string"
          ? product.category
          : product.category._id,
      mainImage: product.mainImage,
      gallery: product.gallery || [],
      accessories: product.accessories || [],
      downloadFiles: product.downloadFiles || [],
      slug: product.slug,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      order: product.order,
    };
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.get("/products");
      setProducts(response.data.products);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Ürünler yüklenirken bir hata oluştu."
      );
      console.error("Ürün yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const authAxios = createAuthAxios();
      const response = await authAxios.get("/categories");
      setCategories(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kategoriler yüklenirken bir hata oluştu."
      );
      console.error("Kategori yükleme hatası:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleFormSuccess = async (data: Partial<Product>) => {
    try {
      const authAxios = createAuthAxios();

      if (selectedProduct && selectedProduct._id) {
        await authAxios.put(`/products/${selectedProduct._id}`, data);
      } else {
        await authAxios.post("/products", data);
      }

      setShowForm(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Ürün kaydedilirken bir hata oluştu."
      );
      console.error("Ürün kaydetme hatası:", err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;

    try {
      const authAxios = createAuthAxios();
      await authAxios.delete(`/products/${confirmDelete}`);
      setProducts(products.filter((product) => product._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Ürün silinirken bir hata oluştu."
      );
      console.error("Ürün silme hatası:", err);
    }
  };

  // Get category name from product
  const getCategoryName = (product: Product) => {
    if (typeof product.category === "string") {
      const category = categories.find((c) => c._id === product.category);
      return category ? category.name : "Kategori Bulunamadı";
    } else {
      return product.category.name;
    }
  };

  // Filter products based on search term and selected category
  const filteredProducts = products.filter((product) => {
    // Filter by search term
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory = selectedCategory
      ? typeof product.category === "string"
        ? product.category === selectedCategory
        : product.category._id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  if (loading && products.length === 0) {
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
        <h2 className="text-2xl font-bold text-gray-800">Ürünler</h2>
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
              placeholder="Ürün ara..."
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
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Kategori Filtresi:
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedCategory === null
                ? "bg-indigo-100 text-indigo-800 font-medium"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedCategory === category._id
                  ? "bg-indigo-100 text-indigo-800 font-medium"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-50 rounded-lg p-1">
          <ProductForm
            product={
              selectedProduct ? convertToFormProduct(selectedProduct) : null
            }
            categories={categories}
            onSubmit={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-md">
          {searchTerm || selectedCategory ? (
            <p className="text-gray-500">
              Arama kriterlerine uygun ürün bulunamadı.
            </p>
          ) : (
            <p className="text-gray-500">Henüz ürün eklenmemiş.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg flex flex-col"
            >
              <div
                className="h-48 bg-gray-200 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${API_URL}${product.mainImage})`,
                }}
              />
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {getCategoryName(product)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {product.isActive && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  )}
                  {!product.isActive && (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Pasif
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Öne Çıkan
                    </span>
                  )}
                  {product.gallery && product.gallery.length > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {product.gallery.length} Görsel
                    </span>
                  )}
                  {product.accessories && product.accessories.length > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      {product.accessories.length} Aksesuar
                    </span>
                  )}
                  {product.downloadFiles &&
                    product.downloadFiles.length > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {product.downloadFiles.length} Dosya
                      </span>
                    )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => handleEditClick(product)}
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
                  onClick={() => handleDeleteClick(product._id)}
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
              Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri
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

export default ProductList;
