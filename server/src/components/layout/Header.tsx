import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/Logo.jpg";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Anasayfa", href: "/" },
  { name: "Kurumsal", href: "/kurumsal" },
  { name: "Ürünler", href: "/urunler" },
  { name: "Sistemler", href: "/sistemler" },
  { name: "Galeri", href: "/galeri" },
  { name: "Referanslar", href: "/referanslar" },
  { name: "Servis", href: "/servis" },
  { name: "İletişim", href: "/iletisim" },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/">
                    <img src={Logo} alt="YILTEK Logo" className="h-12 w-auto" />
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                          : "text-gray-700 hover:bg-primary-100 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary-500 text-white block px-3 py-2 rounded-md text-base font-medium"
                      : "text-gray-700 hover:bg-primary-100 hover:text-primary-700 block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
