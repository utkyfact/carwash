import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';

const Products = ({ onSelectProduct }) => {
  const { productData } = useData();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Produkte filtern
  useEffect(() => {
    let result = [...productData];
    
    // Nach Suchbegriff filtern
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(result);
  }, [productData, searchTerm]);
  
  // Zum Warenkorb hinzufügen
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Verhindert Klick auf Produktkarte
    addToCart(product, 1);
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12">Unsere Produkte</h1>
      
      {/* Suche */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Produkt suchen..."
              className="pl-10 pr-4 py-2 w-full border border-base-300 rounded-md focus:ring-2 focus:ring-base-content focus:border-base-content outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Produktliste */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <a 
              key={product.id} 
              className="bg-base-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              href={`/products/${product.id}`}
              rel="noopener noreferrer"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-base-content mb-3 line-clamp-2 h-10">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-base-content">{product.price} €</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `Auf Lager: ${product.stock}` : 'Ausverkauft'}
                  </span>
                </div>

                {product.stock > 0 && (
                  <button
                    className="mt-3 w-full py-2 bg-base-content hover:bg-base-content/80 text-base-100 rounded transition-colors flex items-center justify-center cursor-pointer"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    In den Warenkorb
                  </button>
                )}
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Produkte gefunden</h3>
            <p className="mt-1 text-sm text-gray-500">Es wurden keine Produkte gefunden, die Ihrer Suche entsprechen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 