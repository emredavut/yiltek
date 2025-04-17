import React from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Placeholder category data
  const category = {
    id: "1",
    name: "Kategori Adı",
    description:
      "Bu kategori açıklaması, ürünler hakkında genel bilgi sağlamaktadır.",
    image: "https://via.placeholder.com/1200x300?text=Kategori+Banner",
  };

  // Placeholder products data
  const products = [
    {
      id: "1",
      name: "Ürün 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      slug: "urun-1",
      image: "https://via.placeholder.com/300x200?text=Ürün+1",
    },
    {
      id: "2",
      name: "Ürün 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      slug: "urun-2",
      image: "https://via.placeholder.com/300x200?text=Ürün+2",
    },
    {
      id: "3",
      name: "Ürün 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      slug: "urun-3",
      image: "https://via.placeholder.com/300x200?text=Ürün+3",
    },
    {
      id: "4",
      name: "Ürün 4",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      slug: "urun-4",
      image: "https://via.placeholder.com/300x200?text=Ürün+4",
    },
  ];

  return (
    <div>
      {/* Category Banner */}
      <div className="relative">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-4xl font-bold text-white mb-2">
              {category.name}
            </h1>
            <p className="text-white/80 max-w-xl">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav>
            <ol className="flex items-center space-x-1 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Anasayfa
                </Link>
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mx-1">/</span>
                <Link
                  to="/urunler"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Ürünler
                </Link>
              </li>
              <li className="flex items-center">
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-900 font-medium">
                  {category.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tüm Ürünler</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              slug={product.slug}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
