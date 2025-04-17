import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Category } from "../types/product";
import CategorySidebar from "../components/CategorySidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

type TabType = "description" | "accessories" | "gallery" | "download";

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        console.log("Fetching product with slug:", slug);
        setLoading(true);

        // Fetch both product and categories in parallel
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_URL}/api/products/slug/${slug}`),
          axios.get(`${API_URL}/api/categories`),
        ]);

        console.log("Product data:", productResponse.data);

        // Handle product data
        if (productResponse.data && productResponse.data._id) {
          setProduct(productResponse.data);

          // Set the product's category as selected if product has a category
          if (productResponse.data.category) {
            const categoryId =
              typeof productResponse.data.category === "string"
                ? productResponse.data.category
                : productResponse.data.category._id;
            setSelectedCategory(categoryId);
          }

          setError(null);
        } else {
          setError("Ürün bulunamadı.");
        }

        // Handle categories data
        const categoriesData = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : [];
        setCategories(categoriesData);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(`Veri yüklenirken bir hata oluştu: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductAndCategories();
    } else {
      setError("Geçersiz ürün URL'si.");
      setLoading(false);
    }
  }, [slug]);

  const openModal = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const nextImage = () => {
    if (!product?.gallery) return;
    const galleryImages = product.gallery || [];
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    setSelectedImage(
      galleryImages[(currentImageIndex + 1) % galleryImages.length]
    );
  };

  const prevImage = () => {
    if (!product?.gallery) return;
    const galleryImages = product.gallery || [];
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
    setSelectedImage(
      galleryImages[
        (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
      ]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || "Ürün bulunamadı."}</p>
      </div>
    );
  }

  // Tab content components
  const DescriptionTab = () => (
    <div className="prose max-w-none">
      <p>{product.description}</p>
    </div>
  );

  const AccessoriesTab = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {product.accessories && product.accessories.length > 0 ? (
        product.accessories.map((accessory, index) =>
          accessory.image ? (
            <motion.div
              key={index}
              className="aspect-square overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => openModal(accessory.image!, index)}
            >
              <img
                src={`${API_URL}${accessory.image}`}
                alt="Aksesuar"
                className="w-full h-full object-cover rounded-md"
              />
            </motion.div>
          ) : null
        )
      ) : (
        <p className="text-gray-500 col-span-full">
          Bu ürün için aksesuar bulunmamaktadır.
        </p>
      )}
    </div>
  );

  const GalleryTab = () => (
    <div className="space-y-6">
      {product?.gallery && product.gallery.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {product.gallery.map((image, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer aspect-square"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                onClick={() => openModal(image, index)}
              >
                <img
                  src={`${API_URL}${image}`}
                  alt={`${product.name} - Görsel ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-90 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">
          Bu ürün için galeri görüntüsü bulunmamaktadır.
        </p>
      )}
    </div>
  );

  const DownloadTab = () => (
    <div className="space-y-4">
      {product.downloadFiles && product.downloadFiles.length > 0 ? (
        product.downloadFiles.map((file, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-10 h-10 flex-shrink-0 mr-4 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              {file.fileType.includes("pdf") ? (
                <span className="text-lg">📄</span>
              ) : (
                <span className="text-lg">🖼️</span>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{file.name}</h3>
              <p className="text-gray-500 text-sm">
                {file.fileType.toUpperCase()}
              </p>
            </div>
            <a
              href={`${API_URL}${file.file}`}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              İndir
            </a>
          </div>
        ))
      ) : (
        <p className="text-gray-500">
          Bu ürün için indirilebilir dosya bulunmamaktadır.
        </p>
      )}
    </div>
  );

  // Kategori adını al
  const categoryName =
    typeof product.category === "object" ? product.category.name : "Kategori";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumbs */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-1 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Anasayfa
            </Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-500 mx-1">/</span>
            <Link to="/urunler" className="text-gray-500 hover:text-gray-700">
              Ürünler
            </Link>
          </li>
          <li className="flex items-center">
            <span className="text-gray-500 mx-1">/</span>
            {typeof product.category === "object" && product.category.slug && (
              <Link
                to={`/urunler/kategori/${product.category.slug}`}
                className="text-gray-500 hover:text-gray-700"
              >
                {categoryName}
              </Link>
            )}
            {!product.category ||
              (typeof product.category !== "object" && (
                <span className="text-gray-500">Kategori</span>
              ))}
          </li>
          <li className="flex items-center">
            <span className="text-gray-500 mx-1">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={(categoryId) => {
            setSelectedCategory(categoryId);
            // Navigate to products page with selected category if user clicks on a category
            if (categoryId) {
              window.location.href = `/urunler?category=${categoryId}`;
            } else {
              window.location.href = `/urunler`;
            }
          }}
        />

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Product Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={`${API_URL}${product.mainImage}`}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="mb-8">
                <p className="text-gray-600 text-lg">
                  {product.description.substring(0, 200)}
                  {product.description.length > 200 && "..."}
                </p>
              </div>

              <div>
                <Link
                  to="/iletisim"
                  state={{ product: product.name }}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-3 rounded-md transition-colors"
                >
                  Teklif İste
                </Link>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "description"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Açıklama
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "accessories"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("accessories")}
              >
                Aksesuarlar
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "gallery"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("gallery")}
              >
                Galeri
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "download"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("download")}
              >
                İndirilebilir Dosyalar
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && <DescriptionTab />}
              {activeTab === "accessories" && <AccessoriesTab />}
              {activeTab === "gallery" && <GalleryTab />}
              {activeTab === "download" && <DownloadTab />}
            </div>
          </div>

          {/* Call To Action */}
          <div className="mt-16 bg-primary-50 p-8 rounded-lg shadow-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bu ürün hakkında daha fazla bilgi almak ister misiniz?
              </h2>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                Teknik özellikler, fiyatlandırma ve özel çözümler için bizimle
                iletişime geçebilirsiniz.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/iletisim"
                  state={{ product: product.name, isQuote: true }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
                >
                  Teklif İste
                </Link>
                <Link
                  to="/iletisim"
                  className="bg-white border border-primary-600 hover:bg-gray-50 text-primary-600 font-medium px-6 py-3 rounded-md transition-colors"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-0 right-0 -mt-12 mr-2 text-white hover:text-gray-200 z-50 bg-black bg-opacity-50 rounded-full p-2 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>

              <div className="flex items-center justify-center h-[80vh] relative">
                <button
                  className="absolute left-4 text-white hover:text-gray-200 z-50 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  src={`${API_URL}${selectedImage}`}
                  alt={`${product.name} - Görsel ${currentImageIndex + 1}`}
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />

                <button
                  className="absolute right-4 text-white hover:text-gray-200 z-50 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="px-4 py-2 bg-black bg-opacity-50 rounded-full text-white text-sm flex items-center space-x-2">
                  <span>{currentImageIndex + 1}</span>
                  <span className="text-gray-400">/</span>
                  <span>{product.gallery.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
