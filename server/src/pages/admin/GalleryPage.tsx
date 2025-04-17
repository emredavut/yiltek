import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { motion } from "framer-motion";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [formType, setFormType] = useState<"image" | "video">("image");

  // Form states
  const [isUsingFile, setIsUsingFile] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/gallery");
      console.log("Admin gallery response:", response.data);
      setGalleryItems(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Galeri öğeleri yüklenirken hata oluştu:", err);
      setError(
        "Galeri öğeleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setFile(null);
    setImageUrl("");
    setVideoUrl("");
    setThumbnailFile(null);
    setFormType("image");
    setIsUsingFile(true);
    setShowAddModal(true);
  };

  const handleEditItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormType(item.type);
    setFile(null);
    setThumbnailFile(null);

    if (item.type === "video") {
      // Check if it's a server file or external URL
      const isServerFile = !item.url.startsWith("http");
      setIsUsingFile(isServerFile);
      setVideoUrl(item.url);
    } else {
      // For images
      const isServerFile = !item.url.startsWith("http");
      setIsUsingFile(isServerFile);
      setImageUrl(item.url);
    }

    setShowAddModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (
      window.confirm("Bu galeri öğesini silmek istediğinizden emin misiniz?")
    ) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`/api/gallery/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGalleryItems(galleryItems.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Galeri öğesi silinirken hata oluştu:", err);
        setError(
          "Galeri öğesi silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      // Add default placeholders for required fields
      formData.append(
        "title",
        formType === "image" ? "Image Gallery Item" : "Video Gallery Item"
      );
      formData.append("description", "");
      formData.append("type", formType);

      if (formType === "image") {
        if (isUsingFile && file) {
          formData.append("file", file);
        } else if (!isUsingFile && imageUrl) {
          formData.append("imageUrl", imageUrl);
        } else {
          throw new Error("Lütfen bir dosya yükleyin veya URL ekleyin");
        }
      } else if (formType === "video") {
        if (isUsingFile && file) {
          formData.append("file", file);
        } else if (!isUsingFile && videoUrl) {
          formData.append("videoUrl", videoUrl);
        } else {
          throw new Error("Lütfen bir dosya yükleyin veya URL ekleyin");
        }

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }
      }

      let response: AxiosResponse<GalleryItem>;
      if (selectedItem) {
        // Update existing item
        const token = localStorage.getItem("adminToken");
        response = await axios.put<GalleryItem>(
          `/api/gallery/${selectedItem._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setUploadProgress(percentCompleted);
            },
          }
        );

        // Update the item in the list
        setGalleryItems(
          galleryItems.map((item) =>
            item._id === selectedItem._id ? response.data : item
          )
        );
      } else {
        // Create new item
        const token = localStorage.getItem("adminToken");
        response = await axios.post<GalleryItem>("/api/gallery", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        });

        // Add the new item to the list
        setGalleryItems([...galleryItems, response.data]);
      }

      // Close modal and reset form
      setShowAddModal(false);
      setFile(null);
      setImageUrl("");
      setVideoUrl("");
      setThumbnailFile(null);
      setSelectedItem(null);
      setIsUsingFile(true);
    } catch (err) {
      console.error("Galeri öğesi kaydedilirken hata oluştu:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Galeri öğesi kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Galeri Yönetimi</h1>
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Yeni Ekle
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Henüz galeri öğesi bulunmamaktadır.</p>
          <button
            onClick={handleAddItem}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            İlk Galeri Öğesini Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="relative pb-[56.25%] bg-gray-100">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="absolute h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute h-full w-full flex items-center justify-center bg-gray-800">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.type === "image"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {item.type === "image" ? "Fotoğraf" : "Video"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {selectedItem
                  ? "Galeri Öğesini Düzenle"
                  : "Yeni Galeri Öğesi Ekle"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  Galeri Türü
                </label>
                <div className="flex space-x-4">
                  <label className="flex-1 relative">
                    <input
                      type="radio"
                      className="form-radio text-primary-600 absolute opacity-0"
                      name="type"
                      value="image"
                      checked={formType === "image"}
                      onChange={() => setFormType("image")}
                    />
                    <div
                      className={`p-4 border-2 rounded-lg flex items-center justify-center transition-all ${
                        formType === "image"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 mr-2 ${
                          formType === "image"
                            ? "text-primary-600"
                            : "text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        className={`font-medium ${
                          formType === "image"
                            ? "text-primary-700"
                            : "text-gray-700"
                        }`}
                      >
                        Fotoğraf
                      </span>
                    </div>
                  </label>
                  <label className="flex-1 relative">
                    <input
                      type="radio"
                      className="form-radio text-primary-600 absolute opacity-0"
                      name="type"
                      value="video"
                      checked={formType === "video"}
                      onChange={() => setFormType("video")}
                    />
                    <div
                      className={`p-4 border-2 rounded-lg flex items-center justify-center transition-all ${
                        formType === "video"
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 mr-2 ${
                          formType === "video"
                            ? "text-primary-600"
                            : "text-gray-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        className={`font-medium ${
                          formType === "video"
                            ? "text-primary-700"
                            : "text-gray-700"
                        }`}
                      >
                        Video
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {formType === "image" && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-lg font-medium text-gray-800">
                      Fotoğraf Ekle
                    </label>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => setIsUsingFile(true)}
                        className={`px-3 py-1 text-sm rounded-l-md ${
                          isUsingFile
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Dosya Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsUsingFile(false)}
                        className={`px-3 py-1 text-sm rounded-r-md ${
                          !isUsingFile
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        URL Ekle
                      </button>
                    </div>
                  </div>

                  {isUsingFile ? (
                    <div className="mt-3">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Dosya seçmek için tıklayın
                            </span>{" "}
                            veya sürükleyip bırakın
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG veya GIF (Maks. 10MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                          required={!selectedItem}
                        />
                      </label>
                      {file && (
                        <div className="mt-3 p-2 bg-gray-50 border rounded-md flex items-center">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        required={!isUsingFile}
                      />
                    </div>
                  )}
                </div>
              )}

              {formType === "video" && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-lg font-medium text-gray-800">
                      Video Ekle
                    </label>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => setIsUsingFile(true)}
                        className={`px-3 py-1 text-sm rounded-l-md ${
                          isUsingFile
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Dosya Yükle
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsUsingFile(false)}
                        className={`px-3 py-1 text-sm rounded-r-md ${
                          !isUsingFile
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        URL Ekle
                      </button>
                    </div>
                  </div>

                  {isUsingFile ? (
                    <div className="mt-3">
                      <label
                        htmlFor="dropzone-video"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Video seçmek için tıklayın
                            </span>{" "}
                            veya sürükleyip bırakın
                          </p>
                          <p className="text-xs text-gray-500">
                            MP4, WebM veya AVI (Maks. 100MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-video"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="video/*"
                          required={!selectedItem && isUsingFile}
                        />
                      </label>
                      {file && (
                        <div className="mt-3 p-2 bg-gray-50 border rounded-md flex items-center">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=video_id veya https://example.com/video.mp4"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        required={!isUsingFile}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        YouTube, Vimeo veya direkt video bağlantısı
                        ekleyebilirsiniz.
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Küçük Resmi (Thumbnail)
                    </label>
                    <input
                      type="file"
                      onChange={handleThumbnailChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {uploadProgress}% Yükleniyor...
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isUploading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  disabled={isUploading}
                >
                  {isUploading
                    ? "Yükleniyor..."
                    : selectedItem
                    ? "Güncelle"
                    : "Ekle"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
