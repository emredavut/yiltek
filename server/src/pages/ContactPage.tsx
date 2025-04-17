import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Logo from "../assets/Logo.jpg";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ContactPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const systemParam = searchParams.get("system");

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    subject: systemParam ? `${systemParam} için Teklif İsteği` : "",
    message: systemParam
      ? `${systemParam} sistemi hakkında teklif almak istiyorum.`
      : "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // URL parametresi değişirse form durumunu güncelle
  useEffect(() => {
    if (systemParam) {
      setFormData((prevState) => ({
        ...prevState,
        subject: `${systemParam} için Teklif İsteği`,
        message: `${systemParam} sistemi hakkında teklif almak istiyorum.`,
      }));
    }
  }, [systemParam]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({});

    try {
      const response = await axios.post(`${API_URL}/api/contact`, formData);
      setStatus({
        success: true,
        message: "Mesajınız başarıyla gönderildi!",
      });
      // Formu temizle
      setFormData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        success: false,
        message: "Mesaj gönderilirken bir hata oluştu, lütfen tekrar deneyin.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section with Background */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-12 mb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              fill="#FFFFFF"
              d="M39.9,-65.7C54.3,-59.6,70.2,-53.5,79.5,-41.8C88.9,-30.1,91.7,-12.9,89.5,3.1C87.3,19.1,80.1,33.9,70.7,46.3C61.3,58.8,49.6,68.9,36.3,73.4C22.9,77.9,7.8,76.8,-6.8,73.9C-21.4,71,-35.4,66.4,-48.6,58.5C-61.8,50.7,-74.1,39.5,-79.1,25.7C-84.1,11.9,-81.7,-4.6,-76.6,-19.8C-71.4,-34.9,-63.4,-48.8,-51.7,-56.3C-40.1,-63.9,-24.8,-65,-10.6,-60.4C3.6,-55.9,11.9,-45.7,22.3,-51.2C32.7,-56.6,45.3,-77.7,51.1,-82.1C56.9,-86.5,55.9,-74.3,50.2,-66.2C44.6,-58.1,34.3,-54.2,39.9,-65.7Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="relative z-10 text-white text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">İletişim</h1>
          <p className="text-xl opacity-90">
            Sorularınız veya işbirliği teklifleriniz için bizimle iletişime
            geçebilirsiniz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Information - 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-2"
        >
          <div className="sticky top-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 relative">
              <span className="inline-block relative pb-2">
                İletişim Bilgilerimiz
                <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-primary-500"></span>
              </span>
            </h2>

            <div className="bg-white p-8 rounded-xl shadow-xl mb-8 transform transition-transform hover:shadow-2xl">
              <div className="flex mb-8">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-600 mb-2">
                    Adres
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Yiltek
                    <br />
                    Birlik Mah. 4255 Sok. No : 45 İç Kapı: 1
                    <br />
                    Bornova / İZMİR
                  </p>
                </div>
              </div>

              <div className="flex mb-8">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-600 mb-2">
                    İletişim
                  </h3>
                  <p className="text-gray-700 text-lg mb-2">
                    <span className="font-medium">Telefon:</span> +90 543 180 35
                    01
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">E-posta:</span>{" "}
                    info@yiltek.net
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-600 mb-2">
                    Çalışma Saatleri
                  </h3>
                  <p className="text-gray-700 text-lg mb-2">
                    <span className="font-medium">Pazartesi - Cuma:</span> 09:00
                    - 18:00
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-medium">Cumartesi - Pazar:</span>{" "}
                    Kapalı
                  </p>
                </div>
              </div>
            </div>

            {/* Company Logo */}
            <div className="bg-white p-8 rounded-xl shadow-xl flex items-center justify-center">
              <img
                src={Logo}
                alt="Yıltek Logo"
                className="max-h-40 object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Form - 3 columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="lg:col-span-3"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 relative">
            <span className="inline-block relative pb-2">
              {systemParam ? `${systemParam} İçin Teklif İsteği` : "Bize Yazın"}
              <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-primary-500"></span>
            </span>
          </h2>

          {status.message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                status.success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* İsim Soyisim ve Firma Adı */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-bold mb-2 transition-colors group-focus-within:text-primary-600"
                  >
                    İsim Soyisim *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="companyName"
                    className="block text-gray-700 font-bold mb-2 transition-colors group-focus-within:text-primary-600"
                  >
                    Firma Adı
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Firma adınız"
                  />
                </div>
              </div>

              {/* E-posta ve Telefon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="group">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-bold mb-2 transition-colors group-focus-within:text-primary-600"
                  >
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-bold mb-2 transition-colors group-focus-within:text-primary-600"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Telefon numaranız"
                  />
                </div>
              </div>

              {/* Konu */}
              <div className="mb-8 group">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-bold mb-2 transition-colors group-focus-within:text-primary-600"
                >
                  Konu *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Mesajınızın konusu"
                />
              </div>

              {/* Mesaj */}
              <div className="mb-8 group">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-bold mb-2 transition-colors group-focus-within:text-primary-600"
                >
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  placeholder="Mesajınızı buraya yazabilirsiniz..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                  sending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {sending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Gönderiliyor...
                  </span>
                ) : (
                  "Gönder"
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
