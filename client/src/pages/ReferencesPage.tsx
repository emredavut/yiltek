import React from "react";
import { motion } from "framer-motion";

// Import logo images
import umtasLogo from "../assets/references/umtas.png";
import b1Logo from "../assets/references/b1logo.png";
import acarLogo from "../assets/references/acar.png";
import gnrLogo from "../assets/references/gnr.png";
import izmirLogo from "../assets/references/izmir.png";
import usakLogo from "../assets/references/usak.png";
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

const ReferencesPage: React.FC = () => {
  // Logo data with imported images
  const clientLogos = [
    { id: "1", name: "UMTAŞ", logo: umtasLogo },
    { id: "2", name: "B1", logo: b1Logo },
    { id: "3", name: "Acar", logo: acarLogo },
    { id: "4", name: "GNR", logo: gnrLogo },
    { id: "5", name: "İzmir", logo: izmirLogo },
    { id: "6", name: "Uşak", logo: usakLogo },
    { id: "7", name: "İstanbul", logo: istanbulLogo },
    { id: "8", name: "Kocaeli", logo: kocaeliLogo },
    { id: "9", name: "Ayg", logo: aygLogo },
    { id: "10", name: "Emitek", logo: emitekLogo },
    { id: "11", name: "Vestel", logo: vestelLogo },
    { id: "12", name: "Manisa", logo: manisaLogo },
    { id: "13", name: "Bursa", logo: bursaLogo },
    { id: "14", name: "Çanakkale", logo: canakkaleLogo },
    { id: "15", name: "Aydin", logo: aydinLogo },
    { id: "16", name: "Erzurum", logo: erzurumLogo },
    { id: "17", name: "Kutahya", logo: kutahyaLogo },
    { id: "18", name: "Biga", logo: bigaLogo },
    { id: "19", name: "Uzunkopru", logo: uzunkopruLogo },
    { id: "20", name: "Marmaris", logo: marmarisLogo },
    { id: "21", name: "Zimag", logo: zimagLogo },
    { id: "22", name: "Esitfaiye", logo: esitfaiyeLogo },
    { id: "23", name: "Ogemsan", logo: ogemsanLogo },
    { id: "24", name: "Gff", logo: gffLogo },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30 opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Referanslarımız
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Yıllar içinde birlikte çalıştığımız ve çözümlerimizi kullandıkları
              için bize güvenen şirketler
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Müşterilerimizden Bazıları
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-12 items-center">
            {clientLogos.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex justify-center"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full h-40 flex items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-28 max-w-full object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Neden Bizi Tercih Ediyorlar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <svg
                  className="w-10 h-10 text-primary-600"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenilirlik</h3>
              <p className="text-gray-600">
                Yılların deneyimi ve güvenilir çözümlerimizle müşterilerimizin
                ihtiyaçlarını karşılıyoruz.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <svg
                  className="w-10 h-10 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Yenilikçi Çözümler</h3>
              <p className="text-gray-600">
                Sektörün ihtiyaçlarını yakından takip ederek en yenilikçi
                çözümleri sunuyoruz.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <svg
                  className="w-10 h-10 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Uzman Destek</h3>
              <p className="text-gray-600">
                Alanında uzman ekibimiz, müşterilerimize projelendirmeden satış
                sonrası desteğe kadar tam hizmet sunuyor.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Onlar Neden Memnun?
            </h2>
            <p className="text-gray-600">
              Müşterilerimizin memnuniyeti başarımızın en büyük göstergesidir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src={acarLogo}
                    alt="ACAR"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ahmet Yılmaz</h3>
                  <p className="text-gray-600 text-sm">Acar Genel Müdürü</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Yiltek ile çalışmaya başladığımızdan beri araç üstü ekipman
                sistemlerimizde verimlilik %40 arttı. Sundukları teknik destek
                ve çözümler sayesinde işlerimiz çok daha hızlı ilerliyor."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src={b1Logo}
                    alt="B1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Mehmet Kaya</h3>
                  <p className="text-gray-600 text-sm">B1 Proje Yöneticisi</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Yıltek'in sunduğu otomasyon sistemleri sayesinde projelerimizde
                zaman ve maliyet tasarrufu sağladık. Teknik ekipleri her zaman
                yanımızda ve çözüm odaklı yaklaşımları bizim için çok değerli."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferencesPage;
