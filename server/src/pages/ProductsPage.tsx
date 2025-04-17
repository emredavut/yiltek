import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/products/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import axios from "axios";
import { Product, Category } from "../types/product";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Kategori İsimlerini Sabit Olarak Tanımlayalım
const ISIK_KULESI = "Işık Kulesi";
const TELESKOPIK_DIREK = "Teleskopik Direk";

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/products`),
        ]);

        // Ensure we have arrays for both responses
        const categoriesData = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : [];

        // productsResponse.data içinden products array'ini alıyoruz
        const productsData =
          productsResponse.data && productsResponse.data.products
            ? productsResponse.data.products
            : [];

        console.log("Alınan ürünler:", productsData);

        setCategories(categoriesData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
        // Set empty arrays in case of error
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update URL when category changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (selectedCategory) {
      searchParams.set("category", selectedCategory);
    } else {
      searchParams.delete("category");
    }
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedCategory, location.pathname, location.search]);

  // Helper function to check if a product belongs to a specific category
  const isProductInCategory = (
    product: Product,
    categoryName: string
  ): boolean => {
    if (
      typeof product.category === "object" &&
      product.category &&
      product.category.name
    ) {
      return product.category.name
        .toLowerCase()
        .includes(categoryName.toLowerCase());
    } else if (typeof product.category === "string") {
      const foundCategory = categories.find((c) => c._id === product.category);
      return foundCategory
        ? foundCategory.name.toLowerCase().includes(categoryName.toLowerCase())
        : false;
    }
    return false;
  };

  // Filter products by selected category
  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    // If a category is selected, filter by that category
    if (selectedCategory) {
      return products.filter((product) => {
        const productCategoryId =
          typeof product.category === "string"
            ? product.category
            : product.category?._id;
        return productCategoryId === selectedCategory;
      });
    }

    // Create a custom ordered array based on priority categories
    const orderedProducts: Product[] = [];

    // STEP 1: First add all Işık Kulesi products
    products.forEach((product) => {
      if (isProductInCategory(product, ISIK_KULESI)) {
        orderedProducts.push(product);
      }
    });

    // STEP 2: Then add all Teleskopik Direk products
    products.forEach((product) => {
      if (isProductInCategory(product, TELESKOPIK_DIREK)) {
        orderedProducts.push(product);
      }
    });

    // STEP 3: Finally add all other products
    products.forEach((product) => {
      if (
        !isProductInCategory(product, ISIK_KULESI) &&
        !isProductInCategory(product, TELESKOPIK_DIREK)
      ) {
        orderedProducts.push(product);
      }
    });

    // Log the result to verify order
    console.log(
      "Sıralanmış ürünler:",
      orderedProducts.map((p) => ({
        name: p.name,
        category:
          typeof p.category === "object"
            ? p.category.name
            : "ID: " + p.category,
      }))
    );

    return orderedProducts;
  }, [products, selectedCategory, categories]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section with Background */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-12 mb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              fill="#FFFFFF"
              d="M47.5,-57.2C59.9,-45.8,67.5,-28.5,70.8,-9.8C74.1,8.9,73.1,29.1,63.4,42.4C53.6,55.7,35.1,62.2,16.7,65.9C-1.7,69.6,-19.9,70.4,-35.6,63.5C-51.3,56.5,-64.4,41.7,-70.3,24.4C-76.2,7,-74.9,-13,-66.4,-28.5C-57.9,-44.1,-42.3,-55.3,-26.7,-64.9C-11.1,-74.6,4.5,-82.8,19.5,-79.8C34.6,-76.9,49.2,-63,63.5,-49.5C77.7,-36,91.7,-23,93.8,-8.5C95.9,6,86.1,21.9,76.5,37.2C66.9,52.5,57.5,67.1,43,72.4C28.6,77.8,9.1,73.9,-7.2,68C-23.6,62.1,-36.9,54.1,-47.8,43.4C-58.7,32.7,-67.3,19.2,-71.2,3.9C-75.1,-11.4,-74.4,-28.6,-66.3,-41.3C-58.2,-54,-42.7,-62.3,-27.4,-67.6C-12.1,-72.9,3.1,-75.2,17.2,-72.4C31.3,-69.6,44.4,-61.7,47.5,-57.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="relative z-10 text-white text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Ürünlerimiz</h1>
          <p className="text-xl opacity-90">
            Araç Üstü Ekipman Otomasyonları ürünlerimizi keşfedin ve
            ihtiyaçlarınıza uygun çözümleri bulun.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar Component */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Main Content - Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-3/4"
        >
          {selectedCategory && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600 text-lg">Kategori:</span>
                  <span className="ml-2 font-semibold text-lg text-primary-600">
                    {categories.find((c) => c._id === selectedCategory)?.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-primary-600 hover:text-primary-800 font-medium bg-white py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Filtreyi Temizle
                </button>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Ürün bulunamadı
              </h3>
              <p className="mt-1 text-gray-500">
                Lütfen farklı bir kategori seçin veya daha sonra tekrar deneyin.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Toplam {filteredProducts.length} ürün bulundu
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      description={product.description}
                      slug={product.slug}
                      image={product.mainImage}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsPage;
