import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Logo from "../../assets/Logo.jpg";
// Import reference logos
import IzmirLogo from "../assets/references/izmir.png";
import UmtasLogo from "../assets/references/umtas.png";
import AcarLogo from "../assets/references/acar.png";
import GnrLogo from "../assets/references/gnr.png";
import B1Logo from "../assets/references/b1logo.png";
import UsakLogo from "../assets/references/usak.png";
import istanbulLogo from "../assets/references/istanbul.jpg";
import kocaeliLogo from "../assets/references/kocaeli.png";
import aygLogo from "../assets/references/ayg.png";
import emitekLogo from "../assets/references/emitek.jpg";
import vestelLogo from "../assets/references/vestel.jpg";
import manisaLogo from "../assets/references/manisa.png";
import bursaLogo from "../assets/references/bursa.png";
import canakkaleLogo from "../assets/references/canakkale.png";
import aydinLogo from "../assets/references/aydin.png";
import erzurumLogo from "../assets/references/erzurum.png";
import kutahyaLogo from "../assets/references/kutahya.png";
import bigaLogo from "../assets/references/biga.jpg";
import uzunkopruLogo from "../assets/references/uzunkopru.png";
import marmarisLogo from "../assets/references/marmaris.png";
import zimagLogo from "../assets/references/zimag.png";
import esitfaiyeLogo from "../assets/references/esitfaiye.jpg";
import ogemsanLogo from "../assets/references/ogemsan.jpeg";
import gffLogo from "../assets/references/gff.png";
import axios from "axios";
import { Product, Category } from "../types/product";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);

        // Fetch categories first to identify required category IDs
        const categoriesResponse = await axios.get(`${API_URL}api/categories`);
        const categories: Category[] = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : [];

        // Find category IDs for our required categories
        const isikKulesiCategory = categories.find(
          (c) =>
            c.name.includes("Işık Kulesi") || c.slug.includes("isik-kulesi")
        );
        const teleskopikDirekCategory = categories.find(
          (c) =>
            c.name.includes("Teleskopik Direk") ||
            c.slug.includes("teleskopik-direk")
        );
        const ekranlarCategory = categories.find(
          (c) => c.name.includes("Ekran") || c.slug.includes("ekran")
        );
        const kontrolCategory = categories.find(
          (c) => c.name.includes("Kontrol") || c.slug.includes("kontrol")
        );
        const aydinlatmaCategory = categories.find(
          (c) => c.name.includes("Aydınlatma") || c.slug.includes("aydinlatma")
        );

        // Fetch all products
        const productsResponse = await axios.get(`${API_URL}api/products`);
        const allProducts: Product[] = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : productsResponse.data &&
            Array.isArray(productsResponse.data.products)
          ? productsResponse.data.products
          : [];

        // Create our specific order of products
        const orderedProducts: Product[] = [];

        // 1. Işık Kulesi product
        if (isikKulesiCategory) {
          const isikKulesiProduct = allProducts.find((product: Product) => {
            const categoryId =
              typeof product.category === "string"
                ? product.category
                : product.category && product.category._id;
            return categoryId === isikKulesiCategory._id;
          });
          if (isikKulesiProduct) orderedProducts.push(isikKulesiProduct);
        }

        // 2. Teleskopik Direk product
        if (teleskopikDirekCategory) {
          const teleskopikDirekProduct = allProducts.find(
            (product: Product) => {
              const categoryId =
                typeof product.category === "string"
                  ? product.category
                  : product.category && product.category._id;
              return categoryId === teleskopikDirekCategory._id;
            }
          );
          if (teleskopikDirekProduct)
            orderedProducts.push(teleskopikDirekProduct);
        }

        // 3. Ekranlar product
        if (ekranlarCategory) {
          const ekranlarProduct = allProducts.find((product: Product) => {
            const categoryId =
              typeof product.category === "string"
                ? product.category
                : product.category && product.category._id;
            return categoryId === ekranlarCategory._id;
          });
          if (ekranlarProduct) orderedProducts.push(ekranlarProduct);
        }

        // 4. Kontrol Ünitesi product
        if (kontrolCategory) {
          const kontrolProduct = allProducts.find((product: Product) => {
            const categoryId =
              typeof product.category === "string"
                ? product.category
                : product.category && product.category._id;
            return categoryId === kontrolCategory._id;
          });
          if (kontrolProduct) orderedProducts.push(kontrolProduct);
        }

        // 5. Çok amaçlı aydınlatma product
        if (aydinlatmaCategory) {
          const aydinlatmaProduct = allProducts.find((product: Product) => {
            const categoryId =
              typeof product.category === "string"
                ? product.category
                : product.category && product.category._id;
            return categoryId === aydinlatmaCategory._id;
          });
          if (aydinlatmaProduct) orderedProducts.push(aydinlatmaProduct);
        }

        // If we don't have 5 products, fill with other featured products
        if (orderedProducts.length < 5) {
          const remainingFeaturedProducts = allProducts
            .filter(
              (product: Product) =>
                product.isFeatured && !orderedProducts.includes(product)
            )
            .slice(0, 5 - orderedProducts.length);

          orderedProducts.push(...remainingFeaturedProducts);
        }

        // Set state with our ordered products (limited to 5)
        setFeaturedProducts(orderedProducts.slice(0, 5));
        setError(null);
      } catch (err: any) {
        console.error("Öne çıkan ürünler getirilirken hata oluştu:", err);
        setError("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Endüstriyel Ekipman ve Otomasyonlar
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Yılların tecrübesi ile geliştirdiğimiz ürünlerimiz ile sizlere en
              iyi hizmeti sunuyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/urunler"
                className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Ürünlerimiz
              </Link>
              <Link
                to="/iletisim"
                className="bg-transparent hover:bg-primary-600 border border-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                İletişime Geçin
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-full h-16 bg-white"
          style={{ clipPath: "polygon(100% 0, 0% 100%, 100% 100%)" }}
        ></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kategorilerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Farklı ihtiyaçlara yönelik geliştirdiğimiz ürün kategorilerimiz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
              <div className="h-48 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="https://i.hizliresim.com/o4dwmsl.PNG"
                  alt="Işık Kulesi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 border-t flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Işık Kulesi
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  Güçlü ve dayanıklı ışık kuleleri
                </p>
                <div className="mt-auto">
                  <Link
                    to="${API_URL}/urunler?category=67fe736b6058abd730b16bda"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ürünleri İncele</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
              <div className="h-48 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="https://i.hizliresim.com/r2sswq6.PNG"
                  alt="Teleskopik Direk"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 border-t flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Teleskopik Direk
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  Yüksek kaliteli teleskopik direkler
                </p>
                <div className="mt-auto">
                  <Link
                    to="https://yiltek.net/urunler?category=67fe73756058abd730b16bde"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ürünleri İncele</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
              <div className="h-48 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="https://i.hizliresim.com/dtw4k89.PNG"
                  alt="Ekranlar"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 border-t flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Ekranlar
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  Çeşitli boyut ve özelliklerde ekranlar
                </p>
                <div className="mt-auto">
                  <Link
                    to="https://yiltek.net/urunler?category=67fe735f6058abd730b16bd6"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ürünleri İncele</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
              <div className="h-48 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="https://i.hizliresim.com/b3t2m7q.PNG"
                  alt="Kontrol Üniteleri"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 border-t flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Kontrol Üniteleri
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  Yüksek performanslı kontrol üniteleri
                </p>
                <div className="mt-auto">
                  <Link
                    to="https://yiltek.net/urunler?category=67fe62656798ebde3e1d593a"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ürünleri İncele</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
              <div className="h-48 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="https://i.hizliresim.com/adye5b8.PNG"
                  alt="Çok Amaçlı Mobil Aydınlatma"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 border-t flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">
                  Çok Amaçlı Mobil Aydınlatma
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  Mobil aydınlatma çözümleri
                </p>
                <div className="mt-auto">
                  <Link
                    to="https://yiltek.net/urunler?category=67fe73806058abd730b16be2"
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Ürünleri İncele</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Çalışma Alanlarımız Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Çalışma Alanlarımız
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Uzmanlık alanlarımız ve hizmet verdiğimiz sektörler
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 p-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-4 mx-auto">
                💻
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Yazılım
              </h3>
              <p className="text-gray-600 text-center">
                Özel projeleriniz için yazılım çözümleri geliştiriyoruz. Kontrol
                sistemleri, veri analitiği ve arayüz tasarımı.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 p-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-4 mx-auto">
                🔌
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Donanım
              </h3>
              <p className="text-gray-600 text-center">
                Yüksek kaliteli donanım çözümleri tasarlıyor ve üretiyoruz.
                Dayanıklı ve güvenilir elektronik sistemler.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 p-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-4 mx-auto">
                🔬
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Ar-Ge</h3>
              <p className="text-gray-600 text-center">
                Sürekli yenilikçilik ve araştırma-geliştirme ile sektörde öncü
                çözümler sunuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 p-6">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-4 mx-auto">
                ✏️
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Özel Tasarımlar
              </h3>
              <p className="text-gray-600 text-center">
                İhtiyaçlarınıza özel tasarım ve üretim hizmetleri. Projelerinize
                özel çözümler geliştiriyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Referanslarımız
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            <div className="flex justify-center">
              <img
                src={IzmirLogo}
                alt="İzmir"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={UmtasLogo}
                alt="UMTAŞ"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img src={AcarLogo} alt="Acar" className="h-16 object-contain" />
            </div>
            <div className="flex justify-center">
              <img src={GnrLogo} alt="GNR" className="h-16 object-contain" />
            </div>
            <div className="flex justify-center">
              <img src={B1Logo} alt="B1Logo" className="h-16 object-contain" />
            </div>{" "}
            <div className="flex justify-center">
              <img src={UsakLogo} alt="Usak" className="h-16 object-contain" />
            </div>
            <div className="flex justify-center">
              <img
                src={istanbulLogo}
                alt="İstanbul"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={kocaeliLogo}
                alt="Kocaeli"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img src={aygLogo} alt="AYG" className="h-16 object-contain" />
            </div>
            <div className="flex justify-center">
              <img
                src={emitekLogo}
                alt="Emitek"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={vestelLogo}
                alt="Vestel"
                className="h-16 object-contain"
              />
            </div>{" "}
            <div className="flex justify-center">
              <img
                src={manisaLogo}
                alt="Manisa"
                className="h-16 object-contain"
              />
            </div>{" "}
            <div className="flex justify-center">
              <img
                src={bursaLogo}
                alt="Bursa"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={canakkaleLogo}
                alt="Canakkale"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={aydinLogo}
                alt="Aydın"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={erzurumLogo}
                alt="Erzurum"
                className="h-16 object-contain"
              />
            </div>{" "}
            <div className="flex justify-center">
              <img
                src={kutahyaLogo}
                alt="Kutahya"
                className="h-16 object-contain"
              />
            </div>{" "}
            <div className="flex justify-center">
              <img src={bigaLogo} alt="Biga" className="h-16 object-contain" />
            </div>{" "}
            <div className="flex justify-center">
              <img
                src={uzunkopruLogo}
                alt="Uzunkopru"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={marmarisLogo}
                alt="Marmaris"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={zimagLogo}
                alt="Zimag"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={esitfaiyeLogo}
                alt="Esitfaiye"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={ogemsanLogo}
                alt="Ogemsan"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img src={gffLogo} alt="Gff" className="h-16 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold mb-6">Hakkımızda</h2>
              <p className="text-gray-300 text-lg mb-6">
                Yıltek olarak, yılların sektör tecrübesi ile Endüstriyel Ekipman
                ve Otomasyon alanında çözümler sunuyoruz. Müşteri memnuniyetini
                ön planda tutarak, kaliteli ürünler ve hizmetler sağlıyoruz.
              </p>
              <Link
                to="/kurumsal"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="bg-primary-100 p-8 rounded-lg">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Kaliteli Ürünler
                      </h3>
                      <p className="text-gray-700">
                        Yüksek kalitede ve uzun ömürlü ürünler üretiyoruz.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Teknik Destek
                      </h3>
                      <p className="text-gray-700">
                        Satış sonrası teknik destek hizmetleri sunuyoruz.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        İnovasyon
                      </h3>
                      <p className="text-gray-700">
                        Sürekli gelişme ve yenilikçilik prensibi ile
                        çalışıyoruz.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Projeleriniz İçin Bize Ulaşın
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Özel çözümler için ekibimiz sizinle görüşmeye hazır. İhtiyaçlarınızı
            belirleyelim ve size en uygun çözümü sunalım.
          </p>
          <Link
            to="/iletisim"
            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-md text-lg transition-colors"
          >
            Hemen İletişime Geçin
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
