import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  createdAt: string;
}

const GalleryPage: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "images" | "videos">(
    "all"
  );
  // Lightbox için state'ler
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/gallery");
        console.log("Gallery response:", response.data);
        setGalleryItems(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Galeri verileri yüklenirken hata oluştu:", err);
        setError(
          "Galeri verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "images") return item.type === "image";
    if (activeFilter === "videos") return item.type === "video";
    return true;
  });

  // Lightbox açma fonksiyonu
  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setLightboxOpen(true);
    // Scroll'u kilitlemek için
    document.body.style.overflow = "hidden";
  };

  // Lightbox kapatma fonksiyonu
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
    // Scroll'u serbest bırakmak için
    document.body.style.overflow = "auto";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Galeri
          </h1>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Projelerimizden fotoğraflar ve videolar
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium border rounded-l-lg ${
                activeFilter === "all"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              Tümü
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium border-t border-b border-r ${
                activeFilter === "images"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setActiveFilter("images")}
            >
              Fotoğraflar
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium border rounded-r-lg ${
                activeFilter === "videos"
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setActiveFilter("videos")}
            >
              Videolar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz galeri öğesi bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {item.type === "image" ? (
                  <div
                    className="relative pb-[66.67%] cursor-pointer"
                    onClick={() => openLightbox(item)}
                  >
                    <img
                      src={item.url}
                      alt={item.title || "Galeri görüntüsü"}
                      className="absolute h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="relative pb-[66.67%]">
                    <video
                      src={item.url}
                      controls
                      poster={item.thumbnail}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-gray-300 focus:outline-none z-50"
              onClick={closeLightbox}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title || "Büyütülmüş görüntü"}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-h-full max-w-full"
                  poster={selectedItem.thumbnail}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
