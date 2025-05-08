import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { theme, changeTheme, getAllThemes } = useTheme();
  const mobileThemeMenuRef = useRef(null);
  const desktopThemeMenuRef = useRef(null);
  const location = useLocation();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleThemeMenu = () => {
    setIsThemeMenuOpen(!isThemeMenuOpen);
  };

  // Tema menüsü dışında bir yere tıklandığında menüyü kapat
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Mobil veya masaüstü tema menü referanslarında tıklama olup olmadığını kontrol et
      const clickedInsideMobileMenu = mobileThemeMenuRef.current && mobileThemeMenuRef.current.contains(event.target);
      const clickedInsideDesktopMenu = desktopThemeMenuRef.current && desktopThemeMenuRef.current.contains(event.target);

      // Eğer her iki menü dışında tıklandıysa, menüyü kapat
      if (!clickedInsideMobileMenu && !clickedInsideDesktopMenu) {
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // URL değiştiğinde menüyü kapat
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Tema değiştiğinde menüyü otomatik kapat
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setIsThemeMenuOpen(false);
  };

  // Tüm temalar
  const allThemes = getAllThemes();

  return (
    <header className="bg-base-100 text-base-content shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-end cursor-pointer">
              <img src="/wolkeLogoTransparent.png" alt="Wolke Carwash Logo" className="w-20 h-20 rounded-full " />
              {/* <span className="text-2xl font-bold hidden md:block">WOLKE</span> */}
              <span className="mb-4 text-accent font-bold">CARWASH</span>
            </Link>
          </div>

          {/* Mobil menü butonu */}
          <div className="md:hidden flex items-center">
            {/* Tema değiştirici (mobil) */}
            <div className="relative mr-3" ref={mobileThemeMenuRef}>
              <button
                onClick={toggleThemeMenu}
                className="p-2 text-base-content hover:text-accent cursor-pointer flex items-center"
                aria-label="Design ändern"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </button>

              {isThemeMenuOpen && (
                <div className="fixed top-16 left-0 right-0 mt-2 mx-4 bg-base-100 rounded-md shadow-lg py-1 z-50 max-h-[70vh] overflow-y-auto">
                  <div className="px-4 py-2 text-sm text-base-content font-semibold border-b sticky top-0 bg-base-100 flex items-center justify-between">
                    <span>Designs</span>
                    <button onClick={() => setIsThemeMenuOpen(false)} className="text-base-content/70 hover:text-error cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2">
                    {allThemes.map((themeName) => (
                      <button
                        key={themeName}
                        onClick={() => handleThemeChange(themeName)}
                        className={`w-full text-left block px-4 py-3 text-sm ${theme === themeName
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-base-content hover:bg-base-200'
                          } cursor-pointer`}
                      >
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sepet butonu (mobil) */}
            <button
              onClick={toggleCart}
              className="relative mr-4 p-1 cursor-pointer"
              aria-label="Warenkorb"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-content text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-content focus:outline-none cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menü */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={({ isActive }) =>
              isActive ? "text-accent font-medium" : "hover:text-accent transition-colors font-medium"
            }>
              Startseite
            </NavLink>
            <NavLink to="/products" className={({ isActive }) =>
              isActive ? "text-accent font-medium" : "hover:text-accent transition-colors font-medium"
            }>
              Unsere Produkte
            </NavLink>
            <NavLink to="/about" className={({ isActive }) =>
              isActive ? "text-accent font-medium" : "hover:text-accent transition-colors font-medium"
            }>
              Über uns
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) =>
              isActive || isAuthenticated ? "text-accent font-medium" : "hover:text-accent transition-colors font-medium"
            }>
              Admin
            </NavLink>
          </nav>

          {/* Tema & Sepet (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Tema değiştirici */}
            <div className="relative" ref={desktopThemeMenuRef}>
              <button
                onClick={toggleThemeMenu}
                className="p-2 text-base-content hover:text-accent flex items-center cursor-pointer"
                aria-label="Design ändern"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
                <span className="hidden sm:inline">{theme}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isThemeMenuOpen && (
                <div className="fixed top-16 left-0 right-0 mt-0 mx-4 bg-base-100 rounded-md shadow-lg py-1 z-50 max-h-[70vh] overflow-y-auto md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-48 md:mx-0">
                  <div className="px-4 py-2 text-sm text-base-content font-semibold border-b sticky top-0 bg-base-100 flex items-center justify-between">
                    <span>Designs</span>
                    <button onClick={() => setIsThemeMenuOpen(false)} className="text-base-content/70 hover:text-error cursor-pointer md:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-1">
                    {allThemes.map((themeName) => (
                      <button
                        key={themeName}
                        onClick={() => handleThemeChange(themeName)}
                        className={`w-full text-left block px-4 py-2 text-sm ${theme === themeName
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-base-content hover:bg-base-200'
                          } cursor-pointer`}
                      >
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sepet butonu */}
            <button
              onClick={toggleCart}
              className="relative p-1 text-base-content hover:text-accent cursor-pointer"
              aria-label="Warenkorb"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-content text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobil menü */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-3">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="py-2 hover:text-accent transition-colors">Startseite</Link>
              <Link to="/products" className="py-2 hover:text-accent transition-colors">Unsere Produkte</Link>
              <Link to="/about" className="py-2 hover:text-accent transition-colors">Über uns</Link>
              <Link to="/admin" className={`py-2 hover:text-accent transition-colors ${isAuthenticated ? "text-accent" : ""}`}>Admin</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 