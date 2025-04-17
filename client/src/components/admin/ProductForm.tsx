import React, { useState, useEffect } from "react";
import axios from "axios";
import { Product, Category } from "../../types/product";
import { createFileUploadAxios } from "../../utils/axiosUtils";

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

// Slugify fonksiyonunu inline tanımlıyorum
const turkishMap: Record<string, string> = {
  ğ: "g",
  Ğ: "G",
  ü: "u",
  Ü: "U",
  ş: "s",
  Ş: "S",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ç: "c",
  Ç: "C",
};

// Metni slug formatına dönüştürür
const slugify = (text: string): string => {
  // Türkçe karakterleri değiştir
  let slug = text.replace(
    /[ğĞüÜşŞıİöÖçÇ]/g,
    (match) => turkishMap[match] || match
  );

  // Küçük harfe çevir, boşlukları tire ile değiştir ve alfanumerik olmayan karakterleri kaldır
  slug = slug
    .toLowerCase()
    .replace(/\s+/g, "-") // boşlukları tire ile değiştir
    .replace(/[^\w\-]+/g, "") // alfanumerik olmayan karakterleri kaldır
    .replace(/\-\-+/g, "-") // çoklu tireleri tek tire yap
    .replace(/^-+/, "") // baştaki tireleri kaldır
    .replace(/-+$/, ""); // sondaki tireleri kaldır

  return slug;
};

interface ProductFormProps {
  categories: Category[];
  product?: Product | null;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    mainImage: "",
    gallery: [],
    accessories: [],
    downloadFiles: [],
    slug: "",
    isActive: true,
    isFeatured: false,
    order: 0,
  });

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        mainImage: product.mainImage,
        gallery: product.gallery,
        accessories: product.accessories,
        downloadFiles: product.downloadFiles,
        slug: product.slug,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        order: product.order,
      });
    }
  }, [product]);

  const handleFileUpload = async (
    file: File,
    type: "image" | "accessory" | "gallery" | "download"
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadAxios = createFileUploadAxios();
      const response = await uploadAxios.post("/upload/combined", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setUploadProgress(percentCompleted);
        },
      });

      // The combined endpoint returns both filePath and imageUrl
      return type === "download"
        ? response.data.filePath
        : response.data.imageUrl;
    } catch (error: any) {
      console.error(`${type} dosyası yükleme hatası:`, error);
      if (error.response) {
        throw new Error(error.response.data.message || "Dosya yükleme hatası");
      } else if (error.request) {
        throw new Error("Sunucuya bağlanılamadı");
      } else {
        throw new Error(error.message || "Dosya yükleme hatası");
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const filePath = await handleFileUpload(e.target.files[0], "image");
        setFormData({ ...formData, mainImage: filePath });
      } catch (error) {
        setErrors({
          ...errors,
          mainImage: "Resim yüklenirken bir hata oluştu.",
        });
      }
    }
  };

  const handleAccessoryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const filePath = await handleFileUpload(e.target.files[0], "accessory");
        const newAccessories = [
          ...(formData.accessories || []),
          { name: e.target.files[0].name, image: filePath },
        ];
        setFormData({ ...formData, accessories: newAccessories });
      } catch (error) {
        setErrors({
          ...errors,
          accessories: "Aksesuar yüklenirken bir hata oluştu.",
        });
      }
    }
  };

  const handleGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const filePath = await handleFileUpload(e.target.files[0], "gallery");
        const newGallery = [...(formData.gallery || []), filePath];
        setFormData({ ...formData, gallery: newGallery });
      } catch (error) {
        setErrors({
          ...errors,
          gallery: "Galeri resmi yüklenirken bir hata oluştu.",
        });
      }
    }
  };

  const handleDownloadChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const filePath = await handleFileUpload(e.target.files[0], "download");

        // MIME tipini backend'in kabul ettiği bir enum değerine dönüştür
        const getFileType = (mimeType: string): string => {
          if (mimeType.includes("pdf")) return "pdf";
          if (mimeType.includes("doc") || mimeType.includes("word"))
            return "doc";
          if (mimeType.includes("image")) return "image";
          return "other";
        };

        const newDownloads = [
          ...(formData.downloadFiles || []),
          {
            name: e.target.files[0].name,
            file: filePath,
            fileType: getFileType(e.target.files[0].type),
          },
        ];
        setFormData({ ...formData, downloadFiles: newDownloads });
      } catch (error) {
        setErrors({
          ...errors,
          downloadFiles: "Dosya yüklenirken bir hata oluştu.",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Form validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.mainImage
    ) {
      setErrors({
        ...errors,
        submit: "Ürün adı, açıklama, kategori ve ana görsel zorunludur.",
      });
      setLoading(false);
      return;
    }

    try {
      const productToSubmit = { ...formData };

      // Slug oluşturma veya mevcut slug kullanma
      if (!productToSubmit.slug && productToSubmit.name) {
        productToSubmit.slug = slugify(productToSubmit.name);
      }

      // API isteği için gerekli veriyi hazırla
      const productData = {
        ...productToSubmit,
        category:
          typeof productToSubmit.category === "string"
            ? productToSubmit.category
            : productToSubmit.category?._id,
        isActive: productToSubmit.isActive ?? true,
        isFeatured: productToSubmit.isFeatured ?? false,
        order: productToSubmit.order ?? 0,
      };

      const authAxios = createAuthAxios();
      let response;

      // Eğer düzenleme ise PUT, yeni ekleme ise POST isteği yap
      if (product && product._id) {
        console.log(`Ürün düzenleniyor (ID: ${product._id})`, productData);
        response = await authAxios.put(`/products/${product._id}`, productData);
      } else {
        console.log("Yeni ürün ekleniyor", productData);
        response = await authAxios.post("/products", productData);
      }

      if (response && response.data) {
        console.log("API yanıtı:", response.data);
        try {
          await onSubmit(productData);
          setLoading(false);
          setErrors({});
        } catch (submitError: any) {
          console.error("onSubmit error:", submitError);
          throw submitError; // Hata yakalamak için yeniden fırlat
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      let errorMessage = "Ürün kaydedilirken bir hata oluştu.";

      if (error.response) {
        // API'den gelen hata mesajını kullan
        errorMessage = error.response.data.message || errorMessage;
        console.error("API Error:", error.response.data);
      }

      setErrors({
        ...errors,
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ürün Adı
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-3"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <div className="flex">
            <input
              type="text"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder={
                formData.name
                  ? slugify(formData.name)
                  : "otomatik-olusturulacak"
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-3"
            />
            {formData.name && !formData.slug && (
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    slug: formData.name ? slugify(formData.name) : "",
                  })
                }
                className="ml-2 mt-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Oluştur
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Boş bırakırsanız ürün adından otomatik oluşturulur.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-3"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={
              typeof formData.category === "string"
                ? formData.category
                : formData.category?._id || ""
            }
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-3"
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div className="flex items-center space-x-8 pt-9">
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-gray-700">
              Aktif
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 text-gray-700">
              Öne Çıkan
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ürün Resmi
        </label>
        <div className="mt-1 flex items-center">
          {formData.mainImage && (
            <div className="mr-4">
              <img
                src={formData.mainImage}
                alt="Ana Görsel"
                className="h-32 w-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
          <div className="flex-1">
            <label className="cursor-pointer bg-white rounded-md border border-gray-300 py-2 px-3 shadow-sm hover:bg-gray-50 inline-block">
              <span className="text-sm text-gray-700">Dosya Seç</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        {errors.mainImage && (
          <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Aksesuarlar
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAccessoryChange}
          className="mt-1 block w-full"
        />
        <div className="mt-2 grid grid-cols-4 gap-4">
          {formData.accessories?.map((accessory, index) => (
            <div key={index} className="relative">
              <img
                src={accessory.image}
                alt={accessory.name}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const newAccessories = formData.accessories?.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, accessories: newAccessories });
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Galeri Resimleri
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleGalleryChange}
          className="mt-1 block w-full"
        />
        <div className="mt-2 grid grid-cols-4 gap-4">
          {formData.gallery?.map((item, index) => (
            <div key={index} className="relative">
              <img
                src={item}
                alt={`Gallery ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  const newGallery = formData.gallery?.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, gallery: newGallery });
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          İndirilebilir Dosyalar
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleDownloadChange}
          className="mt-1 block w-full"
        />
        <div className="mt-2 space-y-2">
          {formData.downloadFiles?.map((download, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span className="text-sm">{download.name}</span>
              <button
                type="button"
                onClick={() => {
                  const newDownloads = formData.downloadFiles?.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, downloadFiles: newDownloads });
                }}
                className="text-red-500 hover:text-red-700"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          disabled={loading}
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 shadow-sm disabled:opacity-50"
          disabled={loading}
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
          ) : product ? (
            "Güncelle"
          ) : (
            "Kaydet"
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
