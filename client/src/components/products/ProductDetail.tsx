import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../../types/product";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with slug:", slug);
        const apiUrl = `${API_URL}/api/products/slug/${slug}`;
        console.log("API URL:", apiUrl);

        const response = await axios.get(apiUrl);
        console.log("Raw API response:", response);
        console.log("Product data:", response.data);

        if (response.data) {
          if (response.data._id) {
            setProduct(response.data);
            setSelectedImage(response.data.mainImage);
            setError(null);
          } else {
            setError("Ürün verileri eksik veya hatalı.");
          }
        } else {
          setError("Ürün bulunamadı.");
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        console.error(
          "Error details:",
          err.response ? err.response.data : "No response data"
        );
        setError(`Ürün bilgileri yüklenirken bir hata oluştu: ${err.message}`);
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    } else {
      setError("Geçersiz ürün URL'si.");
      setLoading(false);
    }
  }, [slug]);

  const openModal = (imageSrc: string) => {
    const allImages = [product?.mainImage, ...(product?.gallery || [])].filter(
      Boolean
    ) as string[];
    const index = allImages.findIndex((img) => img === imageSrc);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setShowModal(true);
  };

  const nextImage = () => {
    const allImages = [product?.mainImage, ...(product?.gallery || [])].filter(
      Boolean
    ) as string[];
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const prevImage = () => {
    const allImages = [product?.mainImage, ...(product?.gallery || [])].filter(
      Boolean
    ) as string[];
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length
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

  // Tüm resimleri bir araya topla
  const allImages = [product.mainImage, ...(product.gallery || [])].filter(
    Boolean
  );
  const currentImage = allImages[currentImageIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-600 hover:text-primary-600">
              Anasayfa
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Link
                to="/urunler"
                className="ml-1 text-gray-600 hover:text-primary-600 md:ml-2"
              >
                Ürünler
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2 font-medium">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Ürün Resimleri */}
          <div>
            <motion.div
              className="rounded-lg overflow-hidden bg-gray-100 mb-6 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => openModal(selectedImage || product.mainImage)}
            >
              <div className="relative">
                <img
                  src={`${API_URL}${selectedImage || product.mainImage}`}
                  alt={product.name}
                  className="w-full h-96 object-contain p-2"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20">
                  <div className="p-3 bg-white bg-opacity-80 rounded-full">
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
              </div>
            </motion.div>

            {/* Galeri Thumbnail'leri */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Galeri</h3>
                <div className="grid grid-cols-5 gap-3">
                  <div
                    className={`cursor-pointer rounded-md overflow-hidden border-2 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 ${
                      selectedImage === product.mainImage
                        ? "border-primary-500 ring-2 ring-primary-200"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(product.mainImage)}
                  >
                    <div className="relative group">
                      <img
                        src={`${API_URL}${product.mainImage}`}
                        alt="Ana Görsel"
                        className="w-full h-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                    </div>
                  </div>
                  {product.gallery.map((img, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 ${
                        selectedImage === img
                          ? "border-primary-500 ring-2 ring-primary-200"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <div className="relative group">
                        <img
                          src={`${API_URL}${img}`}
                          alt={`${product.name} - ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ürün Bilgileri */}
          <div>
            <div className="border-b border-gray-200 pb-6 mb-6">
              {typeof product.category === "object" && product.category && (
                <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full mb-3">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-700 text-lg">{product.description}</p>
            </div>

            {/* Aksesuarlar */}
            {product.accessories && product.accessories.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Aksesuarlar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.accessories.map((accessory, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 flex items-center"
                    >
                      {accessory.image && (
                        <img
                          src={`${API_URL}${accessory.image}`}
                          alt={accessory.name}
                          className="w-16 h-16 object-cover rounded-md mr-3"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {accessory.name}
                        </h3>
                        {accessory.description && (
                          <p className="text-gray-600 text-sm">
                            {accessory.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* İndirilebilir Dosyalar */}
            {product.downloadFiles && product.downloadFiles.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İndirilebilir Dosyalar
                </h2>
                <div className="space-y-3">
                  {product.downloadFiles.map((file, index) => (
                    <a
                      key={index}
                      href={`${API_URL}${file.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-6 h-6 text-primary-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-gray-800">{file.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resim Büyütme Modalı */}
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
                  src={`${API_URL}${currentImage}`}
                  alt={`${product.name} - Görsel ${currentImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
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
                  <span>{allImages.length}</span>
                </div>
              </div>

              {/* Thumbnail strip at the bottom */}
              <div className="absolute bottom-16 left-0 right-0">
                <div className="flex justify-center">
                  <div className="bg-black bg-opacity-50 rounded-lg p-2 mx-auto">
                    <div className="flex space-x-2 overflow-x-auto py-1 max-w-4xl">
                      {allImages.map((img, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer flex-shrink-0 w-16 h-12 rounded ${
                            index === currentImageIndex
                              ? "ring-2 ring-primary-500"
                              : "opacity-60 hover:opacity-100"
                          } transition-all duration-200`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                        >
                          <img
                            src={`${API_URL}${img}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
