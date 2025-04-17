import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  slug,
  image,
}) => {
  // Slug kontrolü - boş ise id kullan
  const safeSlug = slug || id;

  return (
    <div className="h-[420px] w-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col border border-gray-100"
      >
        <div className="relative h-[220px] overflow-hidden">
          <img
            src={image ? `${API_URL}${image}` : "/placeholder.jpg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <h3 className="text-white font-bold px-4 py-3 w-full backdrop-blur-sm bg-black/20">
              {name}
            </h3>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
            {name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {description}
          </p>

          <Link
            to={`/urunler/${safeSlug}`}
            className="mt-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors w-full flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <span>Detayları Gör</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductCard;
