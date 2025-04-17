import React, { useState } from "react";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabItems = [
    { id: "general", label: "Genel Ayarlar", icon: "cog" },
    { id: "notifications", label: "Bildirimler", icon: "bell" },
    { id: "backup", label: "Yedekleme & Bakım", icon: "database" },
    { id: "security", label: "Güvenlik", icon: "shield-check" },
  ];

  // Icons mapping
  const icons: Record<string, React.ReactNode> = {
    cog: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    bell: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    database: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>
    ),
    "shield-check": (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p className="mt-1 text-sm text-gray-600">
          Sistemin tüm ayarlarını buradan yapılandırabilirsiniz
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center mr-8 py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <span className="mr-2">{icons[tab.icon]}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "general" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Genel Ayarlar
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Temel sistem ayarlarını buradan yapılandırabilirsiniz
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label
                      htmlFor="siteName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Site Adı
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="Yiltek Otomasyonları"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sistem Dili
                    </label>
                    <select
                      id="language"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="tr"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">İngilizce</option>
                      <option value="de">Almanca</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Site Açıklaması
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="Araç üstü ekipman otomasyonları için yenilikçi çözümler"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bildirim Ayarları
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                E-posta ve sistem bildirimlerini yapılandırın
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      E-posta Bildirimleri
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Yeni form gönderimlerinde e-posta alın
                    </p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-primary-600"
                    role="switch"
                    aria-checked="true"
                  >
                    <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200">
                      <span className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-0 ease-out duration-100">
                        <svg
                          className="h-3 w-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 ease-in duration-200">
                        <svg
                          className="h-3 w-3 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Tarayıcı Bildirimleri
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Yeni müşteri kayıtlarında bildirim alın
                    </p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 bg-gray-200"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200">
                      <span className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 ease-in duration-200">
                        <svg
                          className="h-3 w-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-0 ease-out duration-100">
                        <svg
                          className="h-3 w-3 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Yedekleme & Bakım
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Sistem yedekleme ve bakım işlemlerini yönetin
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Son Yedeklemeler
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      <li className="px-4 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-400 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="truncate text-gray-700">
                            yiltek_backup_20230812.sql
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          12 Ağustos 2023 - 03:45
                        </div>
                      </li>
                      <li className="px-4 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-400 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="truncate text-gray-700">
                            yiltek_backup_20230805.sql
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          5 Ağustos 2023 - 03:45
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Manuel Yedekleme Oluştur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                Güvenlik Ayarları
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Şifre politikaları ve güvenlik ayarlarını yapılandırın
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Şifre Politikası
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="uppercase"
                          name="uppercase"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="uppercase"
                          className="font-medium text-gray-700"
                        >
                          En az bir büyük harf gerekli
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="specialChar"
                          name="specialChar"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="specialChar"
                          className="font-medium text-gray-700"
                        >
                          En az bir özel karakter gerekli
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="minLength"
                          name="minLength"
                          type="checkbox"
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="minLength"
                          className="font-medium text-gray-700"
                        >
                          En az 8 karakter uzunluğunda
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Oturum Ayarları
                  </h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="sessionTimeout"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Oturum zaman aşımı (dakika)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="sessionTimeout"
                          id="sessionTimeout"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue="30"
                          min="5"
                          max="120"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="maxLoginAttempts"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Maksimum giriş denemesi
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="maxLoginAttempts"
                          id="maxLoginAttempts"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue="5"
                          min="3"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
