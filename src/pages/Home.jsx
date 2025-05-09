import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Home = () => {
  const navigate = useNavigate();
  const { washPackages, sliderData } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const packagesRef = useRef(null);

  // Paket seçildiğinde rezervasyon sayfasına yönlendirme
  const handleSelectPackage = (packageId) => {
    navigate(`/booking/${packageId}`);
  };

  // Paketler bölümüne kaydırma
  const scrollToPackages = () => {
    packagesRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Otomatik slider değişimi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  // Manuel slider değişimi
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  return (
    <main>
      {/* Hero Slider */}
      <div className="relative h-[500px] overflow-hidden">
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.url})` }}
            >
              <div className="absolute inset-0 bg-neutral bg-opacity-40 opacity-50"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-base-100 max-w-3xl px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-base-content bg-base-100 bg-opacity-70 opacity-70 p-4 rounded-lg">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 text-base-content/70 bg-base-100 bg-opacity-70 opacity-70 p-4 rounded-lg">{slide.description}</p>
                <button
                  onClick={scrollToPackages}
                  className="bg-primary hover:bg-primary-focus text-primary-content font-bold py-3 px-8 rounded-full transition-colors text-lg cursor-pointer"
                >
                  Schnell Termin vereinbaren
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider kontrolleri */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-base-100 bg-opacity-30 opacity-50 rounded-full p-2 text-base-content hover:opacity-70 hover:scale-110 transition-all cursor-pointer"
          onClick={prevSlide}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-base-100 bg-opacity-30 opacity-50 rounded-full p-2 text-base-content hover:opacity-70 hover:scale-110 transition-all cursor-pointer"
          onClick={nextSlide}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slider göstergeleri */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${index === currentSlide ? 'bg-base-100 scale-125' : 'bg-base-100 bg-opacity-50'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Paketler Bölümü */}
      <section ref={packagesRef} className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content">Unsere Waschpakete</h2>
            <p className="text-base-content/70 mt-2">Wählen Sie das beste Paket für Ihr Fahrzeug</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {washPackages.map((pkg) => (
              <div key={pkg.id} className="bg-base-100 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                <div className={`${pkg.color} text-white py-4 text-center`}>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <div className="text-3xl font-bold mt-2">{pkg.price} €</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`block w-full text-center py-3 rounded-md text-white font-medium ${pkg.color} hover:opacity-90 transition-opacity cursor-pointer`}
                  >
                    Termin vereinbaren
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neden Bizi Seçmelisiniz */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content">Warum WOLKE CARWASH?</h2>
            <p className="text-base-content/70 mt-2">Entdecken Sie den Unterschied</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Erfahrenes Team</h3>
              <p className="text-base-content/70">Unser erfahrenes Team kümmert sich sorgfältig um Ihr Fahrzeug.</p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 bg-success/10 text-success rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualitätsservice</h3>
              <p className="text-base-content/70">Wir reinigen jeden Winkel Ihres Fahrzeugs mit Premium-Produkten.</p>
            </div>

            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 bg-secondary/10 text-secondary rounded-full">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Zufriedenheit</h3>
              <p className="text-base-content/70">Wir arbeiten mit Fokus auf Kundenzufriedenheit.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home; 