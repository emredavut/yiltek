import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Token hatası olduğunda kullanıcıyı giriş sayfasına yönlendirme
const handleTokenError = () => {
  // localStorage'da token'ı temizle
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUsername");

  // Kullanıcıyı giriş sayfasına yönlendir
  window.location.href = "/admin/login";
};

// Create an authenticated axios instance with the admin token
export const createAuthAxios = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    handleTokenError();
    throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
  }

  const instance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Response interceptor'u ekle
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401 (Unauthorized) veya 403 (Forbidden) hatalarında kullanıcıyı login sayfasına yönlendir
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        handleTokenError();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create an axios instance for file uploads with the admin token
export const createFileUploadAxios = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    handleTokenError();
    throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
  }

  const instance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  // Response interceptor'u ekle
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401 (Unauthorized) veya 403 (Forbidden) hatalarında kullanıcıyı login sayfasına yönlendir
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        handleTokenError();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
