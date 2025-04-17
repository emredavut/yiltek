import React from "react";
import { motion } from "framer-motion";
import { Category } from "../types/product";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  // Define the desired order of categories
  const categoryOrder = [
    "Işık Kulesi",
    "Teleskopik Direk",
    "Ekranlar",
    "Kontrol Üniteleri",
    "Çok Amaçlı Mobil Aydınlatma",
  ];

  // Sort categories according to the specified order
  const sortedCategories = [...categories].sort((a, b) => {
    const aIndex = categoryOrder.findIndex((name) =>
      a.name.toLowerCase().includes(name.toLowerCase())
    );
    const bIndex = categoryOrder.findIndex((name) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    );

    // If both categories are in our order list, sort by the order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // If only a is in our order list, a comes first
    if (aIndex !== -1) return -1;

    // If only b is in our order list, b comes first
    if (bIndex !== -1) return 1;

    // If neither are in our order list, maintain original order
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="md:w-1/4"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
          Kategoriler
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
              selectedCategory === null
                ? "bg-primary-500 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700 hover:translate-x-1"
            }`}
          >
            Tüm Ürünler
          </button>

          {sortedCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedCategory === category._id
                  ? "bg-primary-500 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-700 hover:translate-x-1"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySidebar;
