import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.jpg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img src={Logo} alt="YILTEK Logo" className="h-10 w-auto" />
            </div>
            <p className="text-gray-300 mb-4">
              Endüstriyel Ekipman ve Otomasyon çözümleri üreten firmamız ile
              yılların tecrübesini sizlere sunuyoruz.
            </p>
            <p className="text-gray-300">
              © {new Date().getFullYear()} YİLTEK. Tüm hakları saklıdır.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/kurumsal"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kurumsal
                </Link>
              </li>
              <li>
                <Link
                  to="/urunler"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Ürünler
                </Link>
              </li>
              <li>
                <Link
                  to="/sistemler"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sistemler
                </Link>
              </li>
              <li>
                <Link
                  to="/referanslar"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Referanslar
                </Link>
              </li>
              <li>
                <Link
                  to="/iletisim"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Adres: Birlik Mah. 4255 Sok. No : 45 İç Kapı: 1</p>
              <p>Telefon: +90 543 180 35 01 </p>
              <p>E-posta: info@yiltek.net</p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
