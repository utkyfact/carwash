import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { useData } from '../redux/compat/DataContextCompat';

const ProductDetail = () => {
  const { productId } = useParams();
  const { productData } = useData();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Accordion Referenzen
  const descriptionRef = useRef(null);
  const featuresRef = useRef(null);
  const whyRef = useRef(null);
  
  useEffect(() => {
    // Sayfa yüklendiğinde description accordion'unu açık tut
    setActiveAccordion('description');
    
    // Produktdaten laden
    if (productData.length > 0) {
      const foundProduct = productData.find(p => p.id === productId);
      
      if (foundProduct) {
        // Wenn keine Features vorhanden sind, leeres Array erstellen
        setProduct({
          ...foundProduct,
          features: foundProduct.features || []
        });
        
        // Ähnliche Produkte bestimmen (zufällig 4 verschiedene Produkte)
        const otherProducts = productData.filter(p => p.id !== productId);
        const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
        
        // Für jedes ähnliche Produkt einen eindeutigen Schlüssel mit Zeitstempel erstellen
        const timestamp = Date.now();
        setRelatedProducts(shuffled.slice(0, 4).map((p, index) => ({
          ...p,
          features: p.features || [],
          uniqueKey: `related-${p.id}-${timestamp}-${index}` // Eindeutigen Schlüssel mit Zeitstempel und Index erstellen
        })));
      }
      
      setIsLoading(false);
    }
  }, [productId, productData]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };
  
  // Funktion zur Berechnung der Accordion-Inhaltshöhe
  const getMaxHeight = (ref) => {
    return ref.current ? `${ref.current.scrollHeight}px` : '0px';
  };
  
  // Produkt zum Warenkorb hinzufügen
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setAddedToCart(true);
    
    // Nachricht nach 3 Sekunden entfernen
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };
  
  if (isLoading) {
    return (
      <div className="py-16 px-4 container mx-auto flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="py-16 px-4 container mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-600 mb-4">Produkt nicht gefunden</h2>
          <p className="text-gray-500 mb-6">Das gewünschte Produkt ist nicht verfügbar oder wurde entfernt.</p>
          <a 
            href="/products"
            className="bg-base-content text-base-100 px-6 py-2 rounded-md hover:bg-base-content/80 transition-colors cursor-pointer inline-block"
          >
            Zurück zu Produkten
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <main className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        {/* Produktdetails */}
        <div className="bg-base-100 rounded-lg shadow-md overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row">
            {/* Produktbild */}
            <div className="md:w-1/2 h-96">
              <div className="h-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Produktinformationen */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="mb-2">
                <a
                  href="/products"
                  className="text-base-content hover:text-base-content/80 mb-4 flex items-center cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Zurück zu Produkten
                </a>
              </div>
              
              <h1 className="text-3xl font-bold text-base-content mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <span className="bg-base-content text-base-100 text-xl font-bold px-4 py-1 rounded-full">
                  {product.price} €
                </span>
                <span className={`ml-4 text-sm px-3 py-1 rounded-full ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `Auf Lager (${product.stock})` : 'Ausverkauft'}
                </span>
              </div>
              
              <p className="text-base-content mb-6 text-lg">{product.description}</p>
              
              {product.stock > 0 ? (
                <>
                  <div className="flex items-center mb-6">
                    <span className="text-base-content mr-4">Menge:</span>
                    <div className="flex items-center border border-base-content rounded-md">
                      <button 
                        onClick={decreaseQuantity}
                        className="px-3 py-1 text-base-content hover:bg-base-content/10 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-12 text-center border-0 focus:outline-none"
                      />
                      <button 
                        onClick={increaseQuantity}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={handleAddToCart}
                      className={`w-full ${addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-base-content hover:bg-base-content/80'} text-base-100 py-3 rounded-md transition-colors flex items-center justify-center cursor-pointer`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {addedToCart ? 'Produkt zum Warenkorb hinzugefügt!' : 'In den Warenkorb'}
                    </button>
                    
                    {addedToCart && (
                      <div className="absolute left-0 right-0 -bottom-10 bg-base-content text-base-100 text-center py-2 rounded-md text-sm">
                        Produkt wurde zum Warenkorb hinzugefügt! ✓
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button 
                  className="w-full bg-base-content text-base-100 py-3 rounded-md cursor-not-allowed"
                  disabled
                >
                  Produkt ausverkauft
                </button>
              )}
              
              {/* Produktdetails */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-base-content mb-3">Produktdetails</h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="text-base-content w-1/3">Produktcode:</span>
                    <span className="text-base-content">{product.id}</span>
                  </li>
                  <li className="flex">
                    <span className="text-base-content w-1/3">Lagerstatus:</span>
                    <span className="text-base-content">{product.stock > 0 ? 'Auf Lager' : 'Ausverkauft'}</span>
                  </li>
                  <li className="flex">
                    <span className="text-base-content w-1/3">Kategorie:</span>
                    <span className="text-base-content">Autopflegeprodukte</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Accordion-Bereich */}
        <div className="bg-base-100 rounded-lg shadow-md overflow-hidden mb-10">
          {/* Produktbeschreibung Accordion */}
          <div className="border-b border-base-300 last:border-b-0">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'description' ? '' : 'description')}
              className="flex justify-between items-center w-full p-5 text-left cursor-pointer"
            >
              <h2 className="text-xl font-bold text-base-content">Produktbeschreibung</h2>
              <svg 
                className={`w-6 h-6 text-base-content transform transition-transform duration-300`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {activeAccordion === 'description' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                )}
              </svg>
            </button>
            
            <div 
              ref={descriptionRef}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: activeAccordion === 'description' ? '500px' : '0',
                opacity: activeAccordion === 'description' ? 1 : 0
              }}
            >
              <div className="p-5">
                <p className="text-base-content">{product.description}</p>
                <p className="text-base-content mt-4">
                  Dieses Produkt, angeboten mit WOLKE CARWASH Qualität, liefert Ihnen hervorragende Ergebnisse bei der Autopflege. 
                  Es ist auch für den professionellen Gebrauch geeignet und beschädigt die Fahrzeugoberfläche nicht.
                </p>
              </div>
            </div>
          </div>
          
          {/* Produkteigenschaften Accordion */}
          <div className="border-b border-base-300 last:border-b-0">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'features' ? '' : 'features')}
              className="flex justify-between items-center w-full p-5 text-left cursor-pointer"
            >
              <h2 className="text-xl font-bold text-base-content">Produkteigenschaften</h2>
              <svg 
                className={`w-6 h-6 text-base-content transform transition-transform duration-300`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {activeAccordion === 'features' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                )}
              </svg>
            </button>
            
            <div 
              ref={featuresRef}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: activeAccordion === 'features' ? '500px' : '0',
                opacity: activeAccordion === 'features' ? 1 : 0
              }}
            >
              <div className="p-5">
                {product.features && product.features.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={`feature-${product.id}-${index}`} className="flex items-start mb-2">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base-content">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base-content italic">Für dieses Produkt wurden noch keine Eigenschaften definiert.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Warum WOLKE CARWASH Produkte? Accordion */}
          <div className="border-b border-base-300 last:border-b-0">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'why' ? '' : 'why')}
              className="flex justify-between items-center w-full p-5 text-left cursor-pointer"
            >
              <h2 className="text-xl font-bold text-base-content">Warum WOLKE CARWASH Produkte?</h2>
              <svg 
                className={`w-6 h-6 text-base-content transform transition-transform duration-300`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {activeAccordion === 'why' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                )}
              </svg>
            </button>
            
            <div 
              ref={whyRef}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: activeAccordion === 'why' ? '500px' : '0',
                opacity: activeAccordion === 'why' ? 1 : 0
              }}
            >
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">Qualitätsgarantie</h3>
                    <p className="text-base-content">Alle unsere Produkte haben Qualitätstests bestanden.</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">Umweltfreundlich</h3>
                    <p className="text-base-content">Hergestellt mit umweltfreundlichen Inhaltsstoffen.</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">Professionelle Ergebnisse</h3>
                    <p className="text-base-content">Erzielen Sie Ergebnisse wie in professionellen Autowaschanlagen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ähnliche Produkte */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-6">Ähnliche Produkte</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <a 
                  key={relatedProduct.uniqueKey}
                  href={`/products/${relatedProduct.id}`}
                  className="bg-base-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base-content mb-2">{relatedProduct.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">{relatedProduct.price} €</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        relatedProduct.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {relatedProduct.stock > 0 ? 'Auf Lager' : 'Ausverkauft'}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail; 