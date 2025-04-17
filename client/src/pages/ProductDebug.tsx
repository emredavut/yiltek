import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductDebug: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<any>(null);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products`);
        console.log("API Response:", response.data);

        const productsData =
          response.data && response.data.products ? response.data.products : [];

        setProducts(productsData);
        setError(null);
      } catch (err: any) {
        console.error("Ürünleri yüklerken hata:", err);
        setError(`Ürünleri yüklerken bir hata oluştu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchProductBySlug = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const apiUrl = `${API_URL}/api/products/slug/${slug}`;
      console.log("API URL:", apiUrl);

      const response = await axios.get(apiUrl);
      console.log("Product Detail Response:", response);
      setProductDetail(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Ürün detaylarını yüklerken hata:", err);
      setError(`Ürün detaylarını yüklerken bir hata oluştu: ${err.message}`);
      setProductDetail(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ürün Hata Ayıklama</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Slug ile Ürün Sorgulama</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Ürün slug'ını girin"
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={fetchProductBySlug}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={!slug || loading}
          >
            Sorgula
          </button>
        </div>

        {productDetail && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Ürün Detayları</h3>
            <pre className="bg-white p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(productDetail, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">
        Tüm Ürünler ({products.length})
      </h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-md p-4"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{product.name}</h3>
                <span className="text-sm text-gray-500">ID: {product._id}</span>
              </div>
              <p className="text-sm mb-2 text-gray-600">
                {product.description.substring(0, 100)}...
              </p>
              <div className="text-sm text-gray-500 mb-2">
                <strong>Slug:</strong> {product.slug}
              </div>
              {product.mainImage && (
                <div className="mb-2">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>Kategori:</strong>{" "}
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </div>
                <div>
                  <strong>Aktif:</strong> {product.isActive ? "Evet" : "Hayır"}
                </div>
                <div>
                  <strong>Öne Çıkan:</strong>{" "}
                  {product.isFeatured ? "Evet" : "Hayır"}
                </div>
                <div>
                  <strong>Sıra:</strong> {product.order}
                </div>
                <div>
                  <strong>Aksesuar Sayısı:</strong>{" "}
                  {product.accessories?.length || 0}
                </div>
                <div>
                  <strong>Galeri Resim Sayısı:</strong>{" "}
                  {product.gallery?.length || 0}
                </div>
                <div>
                  <strong>Dosya Sayısı:</strong>{" "}
                  {product.downloadFiles?.length || 0}
                </div>
              </div>
              <button
                onClick={() => setSlug(product.slug)}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                Bu ürünün detaylarını sorgula
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDebug;
