import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-600 mb-6">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
