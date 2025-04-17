import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ServicePage: React.FC = () => {
  // Servis kart verileri
  const services = [
    {
      id: 1,
      title: "Teknik Servis",
      description:
        "Tüm ürünlerimiz için yerinde teknik servis desteği sunuyoruz. Profesyonel ekibimiz en kısa sürede sorununuzu çözüme kavuşturur.",
      icon: "🔧",
    },
    {
      id: 2,
      title: "Bakım Anlaşmaları",
      description:
        "Düzenli bakım ile cihazlarınızın ömrünü uzatın ve performansını artırın. Yıllık bakım anlaşmalarımızla size özel hizmet sunuyoruz.",
      icon: "📋",
    },
    {
      id: 3,
      title: "Kurulum Hizmetleri",
      description:
        "Ürünlerinizin profesyonel kurulumunu gerçekleştiriyoruz. Doğru kurulum, uzun vadede size zaman ve maliyet tasarrufu sağlar.",
      icon: "🛠️",
    },
    {
      id: 4,
      title: "Yazılım Güncelleme",
      description:
        "Sistemlerinizin yazılımlarını en güncel sürüme yükseltiyoruz. Yeni özellikler ve güvenlik önlemleri ile sisteminizi güçlendirin.",
      icon: "💻",
    },
    {
      id: 5,
      title: "Eğitim",
      description:
        "Ürünlerinizin kullanımı hakkında ekiplerinize eğitim veriyoruz. Kapsamlı eğitim programlarımızla sistemlerinizden maksimum verim alın.",
      icon: "📚",
    },
    {
      id: 6,
      title: "7/24 Destek",
      description:
        "Acil durumlar için 7/24 destek hattımız her zaman hizmetinizde. Teknik ekibimiz uzaktan destek ile birçok sorunu anında çözebilir.",
      icon: "📞",
    },
  ];

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
          <h1 className="text-5xl font-bold mb-6">Servis Hizmetlerimiz</h1>
          <p className="text-xl opacity-90">
            Profesyonel ekibimizle size özel çözümler sunuyoruz. Tüm
            ürünlerimizde kaliteli servis garantisi.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Hizmetlerimiz
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary-500 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
            İhtiyaçlarınıza uygun servis hizmetlerimiz ile her zaman
            yanınızdayız
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-20 bg-gray-50 p-12 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Servis Sürecimiz
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hızlı ve kaliteli hizmet için izlediğimiz adımlar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-bold mb-2">Talep</h3>
            <p className="text-gray-600">
              Servis talebinizi iletişim formumuzdan veya telefonla bize
              iletebilirsiniz.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-bold mb-2">Değerlendirme</h3>
            <p className="text-gray-600">
              Uzman ekibimiz sorununuzu değerlendirir ve en uygun çözümü önerir.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-bold mb-2">Uygulama</h3>
            <p className="text-gray-600">
              Profesyonel servis ekibimiz gerekli işlemleri gerçekleştirir.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-bold mb-2">Takip</h3>
            <p className="text-gray-600">
              Servis sonrası memnuniyetinizi sağlamak için takip ederiz.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 text-white rounded-xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Servis Desteği mi İhtiyacınız Var?
        </h2>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Teknik servis, bakım ve destek hizmetlerimiz için hemen bizimle
          iletişime geçin. Uzman ekibimiz en kısa sürede yanınızda olacak.
        </p>
        <Link
          to="/iletisim"
          className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-md text-lg transition-colors"
        >
          İletişime Geçin
        </Link>
      </div>
    </div>
  );
};

export default ServicePage;
