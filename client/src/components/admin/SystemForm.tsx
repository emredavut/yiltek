import React, { useState, useRef } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface SystemFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const SystemForm: React.FC<SystemFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState<"url" | "file">("url");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!initialData?._id;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // Dosya seçildiğinde, URL alanını temizle
      setImageUrl("");
    }
  };

  const handleFileUpload = async (): Promise<string> => {
    if (!selectedFile) return "";

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        `${API_URL}/api/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      return response.data.imageUrl;
    } catch (err) {
      throw new Error("Dosya yüklenirken bir hata oluştu");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Eğer dosya yükleme seçildiyse, önce dosyayı yükle
      let finalImageUrl = imageUrl;

      if (uploadType === "file" && selectedFile) {
        finalImageUrl = await handleFileUpload();
      }

      if (!finalImageUrl && uploadType === "url") {
        setError("Lütfen bir görsel URL'si girin");
        setLoading(false);
        return;
      }

      if (!finalImageUrl && uploadType === "file") {
        setError("Lütfen bir görsel dosyası seçin");
        setLoading(false);
        return;
      }

      const systemData = { name, description, imageUrl: finalImageUrl };

      if (isEditing) {
        await axios.put(
          `${API_URL}/api/admin/systems/${initialData._id}`,
          systemData,
          config
        );
      } else {
        await axios.post(`${API_URL}/api/admin/systems`, systemData, config);
      }

      onSuccess();
    } catch (err) {
      setError("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadType("file");
      // Dosya bırakıldığında, URL alanını temizle
      setImageUrl("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {isEditing ? "Sistemi Düzenle" : "Yeni Sistem Ekle"}
      </h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sistem Adı
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Açıklama
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Görsel
          </label>

          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setUploadType("url")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                uploadType === "url"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              URL Gir
            </button>
            <button
              type="button"
              onClick={() => setUploadType("file")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                uploadType === "file"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Dosya Yükle
            </button>
          </div>

          {uploadType === "url" ? (
            <div className="mb-4">
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Görselin tam URL adresini girin
              </p>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4"
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {selectedFile ? (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Seçilen dosya:</p>
                  <p className="font-medium text-indigo-600">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Dosya seçmek için tıklayın veya buraya sürükleyin
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF (maks. 10MB)
                  </p>
                </div>
              )}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1 text-right">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {(imageUrl ||
          (uploadType === "file" &&
            selectedFile &&
            URL.createObjectURL(selectedFile))) && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Görsel Önizleme
            </p>
            <img
              src={
                uploadType === "url"
                  ? imageUrl
                  : selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : ""
              }
              alt="Önizleme"
              className="w-full h-48 object-cover rounded-md border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/400x200?text=Görsel+Yüklenemedi";
              }}
            />
          </div>
        )}

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
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            )}
            {loading ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemForm;
