import React from "react";
import { motion } from "framer-motion";
import Logo from "../assets/Logo.jpg";

const AboutPage: React.FC = () => {
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
              d="M40,-51.2C51.2,-41.3,59.7,-27.4,65.7,-10.9C71.8,5.7,75.4,24.8,67.8,38.1C60.1,51.4,41.3,58.9,22.7,64.8C4.2,70.7,-14.1,75,-29.5,69.5C-44.9,63.9,-57.3,48.5,-64.8,30.7C-72.3,13,-74.8,-7.2,-68.8,-24.2C-62.9,-41.3,-48.5,-55.3,-33.3,-64.3C-18.1,-73.3,-2.1,-77.2,12.1,-72.8C26.3,-68.4,40.2,-55.7,51.5,-44.3C62.8,-33,70.4,-13.8,70.4,3.4C70.4,20.6,62.9,35.8,51.5,46.2C40.2,56.7,25,62.3,8.7,66.2C-7.6,70.1,-25,72.2,-39.8,66.2C-54.6,60.1,-66.7,45.8,-70.4,30C-74,14.1,-69.1,-3.3,-62.9,-19.3C-56.8,-35.3,-49.3,-49.9,-37.9,-58.9C-26.5,-67.9,-11.2,-71.3,2.7,-69.6C16.7,-67.9,33.3,-61.1,40,-51.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="relative z-10 text-white text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Kurumsal</h1>
          <p className="text-xl opacity-90">
            Yılların tecrübesine sahip ekibimiz ile endüstriyel ekipman ve
            otomasyon çözümleri üreten firmamız ile alanında lider çözümler
            sunuyoruz.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-xl shadow-xl border-l-4 border-primary-500 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-600">
                Misyonumuz
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Mühendislik uzmanlığımızı ve ileri teknolojiyi birleştirerek,
              projelerinize özel, sürdürülebilir ve katma değer sağlayan
              çözümler sunmayı hedefliyoruz. Müşterilerimize kesintisiz ve
              güvenilir hizmetler sağlayarak, onların memnuniyetini her zaman ön
              planda tutuyoruz. Bu yaklaşım, iş birliğimizin temelini
              oluşturuyor.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-xl shadow-xl border-l-4 border-primary-500 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-600">
                Vizyonumuz
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Sektördeki teknolojik gelişmelere öncülük ederek, araç üstü
              ekipman üreticilerine sistem, ürün, tasarım ve otomasyon alanında
              global bir referans noktası olmak, sektörde dijital dönüşümün
              liderlerinden biri haline gelmek, müşteri memnuniyetini en üst
              düzeyde tutarak, güvenilir ve çevreye duyarlı çözümlerle sektörde
              fark yaratmaktır.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Company Overview */}
      <div className="mb-24 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -z-10 opacity-5">
          <svg
            width="400"
            height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#000000"
              d="M47.5,-57.2C59.9,-45.8,67.5,-28.5,70.8,-9.8C74.1,8.9,73.1,29.1,63.4,42.4C53.6,55.7,35.1,62.2,16.7,65.9C-1.7,69.6,-19.9,70.4,-35.6,63.5C-51.3,56.5,-64.4,41.7,-70.3,24.4C-76.2,7,-74.9,-13,-66.4,-28.5C-57.9,-44.1,-42.3,-55.3,-26.7,-64.9C-11.1,-74.6,4.5,-82.8,19.5,-79.8C34.6,-76.9,49.2,-63,63.5,-49.5C77.7,-36,91.7,-23,93.8,-8.5C95.9,6,86.1,21.9,76.5,37.2C66.9,52.5,57.5,67.1,43,72.4C28.6,77.8,9.1,73.9,-7.2,68C-23.6,62.1,-36.9,54.1,-47.8,43.4C-58.7,32.7,-67.3,19.2,-71.2,3.9C-75.1,-11.4,-74.4,-28.6,-66.3,-41.3C-58.2,-54,-42.7,-62.3,-27.4,-67.6C-12.1,-72.9,3.1,-75.2,17.2,-72.4C31.3,-69.6,44.4,-61.7,47.5,-57.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <h2 className="text-4xl font-bold text-center mb-16 relative">
          <span className="inline-block relative">
            Şirketimiz Hakkında
            <span className="absolute -bottom-3 left-0 w-full h-1 bg-primary-500"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={Logo}
              alt="Yıltek Logo"
              className="rounded-xl shadow-xl w-full transform hover:scale-105 transition-transform duration-500 object-contain bg-white p-8"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <span className="bg-primary-100 p-2 rounded-full mr-3">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  Kalite ve İnovasyon
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed ml-12">
                  Yiltek olarak, Endüstriyel Ekipman ve Otomasyon çözümleri
                  üreten firmamız ile alanında lider konumumuzu sürdürmek için
                  sürekli inovasyon ve yüksek kalite standartlarını
                  benimsiyoruz. Müşteri memnuniyeti odaklı çalışarak, kaliteli
                  ve güvenilir çözümler sunuyoruz.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                  <span className="bg-primary-100 p-2 rounded-full mr-3">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                  </span>
                  Değerlerimiz
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed ml-12">
                  Teknolojik gelişmeleri yakından takip ederek, en iyi ürün ve
                  hizmetleri müşterilerimize sunmak önceliğimizdir. Sürekli
                  gelişim ve iyileştirme ile müşterilerimizin ihtiyaçlarını en
                  iyi şekilde karşılamayı hedefliyoruz.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 px-8 bg-gray-50 rounded-2xl shadow-inner mb-20">
        <h2 className="text-4xl font-bold text-center mb-16 relative">
          <span className="inline-block relative">
            Değerlerimiz
            <span className="absolute -bottom-3 left-0 w-full h-1 bg-primary-500"></span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 text-center transform hover:-translate-y-2 transition-transform"
          >
            <div className="bg-primary-100 text-primary-600 w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              ⚙️
            </div>
            <h3 className="text-2xl font-bold mb-4">Kalite</h3>
            <p className="text-gray-600 text-lg">
              Her ürün ve hizmetimizde en yüksek kalite standartlarını sağlamak
              için çalışıyoruz.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 text-center transform hover:-translate-y-2 transition-transform"
          >
            <div className="bg-primary-100 text-primary-600 w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🔧
            </div>
            <h3 className="text-2xl font-bold mb-4">Güvenilirlik</h3>
            <p className="text-gray-600 text-lg">
              Güvenilir çözümler sunmak ve müşteri güvenini kazanmak temel
              prensiplerimizdendir.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 text-center transform hover:-translate-y-2 transition-transform"
          >
            <div className="bg-primary-100 text-primary-600 w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              💡
            </div>
            <h3 className="text-2xl font-bold mb-4">Yenilikçilik</h3>
            <p className="text-gray-600 text-lg">
              Sektördeki yenilikleri takip ederek, sürekli gelişim ve inovasyon
              odaklı çalışıyoruz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl p-12">
        <h2 className="text-3xl font-bold mb-6">
          Bizimle Çalışmak İster misiniz?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Projeleriniz için özel çözümler sunmaktan mutluluk duyarız. Detaylı
          bilgi için bize ulaşın.
        </p>
        <a
          href="/iletisim"
          className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          İletişime Geçin
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
