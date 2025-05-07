import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';

const Cart = () => {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart, 
    totalPrice,
    clearCart
  } = useCart();
  
  const { createOrder } = useOrder();
  
  // Kullanıcı bilgileri için state
  const [isCheckout, setIsCheckout] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Form değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Ödeme işlemi
  const handleCheckout = () => {
    setIsCheckout(true);
  };
  
  // Sipariş tamamlama
  const handlePlaceOrder = () => {
    // Sipariş oluştur
    createOrder(cartItems, userInfo, totalPrice);
    
    // Sepeti temizle ve başarılı mesajını göster
    clearCart();
    setIsCheckout(false);
    setOrderSuccess(true);
    
    // 3 saniye sonra başarılı mesajını kapat
    setTimeout(() => {
      setOrderSuccess(false);
      toggleCart();
    }, 3000);
  };
  
  return (
    <>
      {/* Karartma Arka Planı */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        ></div>
      )}
      
      {/* Sepet Kenar Çubuğu */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-base-100 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sepet Başlığı */}
          <div className="bg-primary p-4 text-primary-content flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {isCheckout ? 'Bestellung abschließen' : 'Ihr Warenkorb'}
            </h2>
            <button 
              onClick={toggleCart}
              className="text-primary-content hover:text-accent focus:outline-none cursor-pointer"
              aria-label="Warenkorb schließen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sipariş Başarılı Mesajı */}
          {orderSuccess ? (
            <div className="flex-grow overflow-y-auto p-4">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-success-content" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Bestellung erhalten!</h3>
                <p className="text-center mb-4">Ihre Bestellung wurde erfolgreich aufgenommen. Ihre Produkte werden in Kürze vorbereitet. Bitte kommen Sie zur Abholung der Produkte.</p>
              </div>
            </div>
          ) : isCheckout ? (
            /* Ödeme Formu */
            <div className="flex-grow overflow-y-auto p-4">
              <div className="mb-6">
                <label className="block text-base-content mb-2">Vor- und Nachname</label>
                <input 
                  type="text" 
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-base-content mb-2">E-Mail</label>
                <input 
                  type="email" 
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-base-content mb-2">Telefon</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-base-content mb-2">Adresse</label>
                <textarea 
                  name="address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary h-24"
                  required
                ></textarea>
              </div>
            </div>
          ) : (
            /* Sepet İçeriği */
            <div className="flex-grow overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="w-16 h-16 text-base-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-base-content mb-2">Ihr Warenkorb ist leer</p>
                  <button 
                    onClick={toggleCart}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    Mit dem Einkaufen beginnen
                  </button>
                </div>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.addedAt}`} className="border-b border-base-200 py-4 flex">
                      <div className="w-20 h-20 bg-base-200 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-base-content">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.addedAt)}
                            className="text-base-content opacity-50 hover:opacity-100 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-primary font-semibold mt-1">
                          {item.price} €
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-base-content mr-2">Menge:</span>
                          <div className="flex items-center border border-base-300 rounded">
                            <button 
                              onClick={() => decreaseQuantity(item.id, item.addedAt)}
                              className="w-8 h-8 flex items-center justify-center text-base-content hover:bg-base-200 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-base-content">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => increaseQuantity(item.id, item.addedAt)}
                              className="w-8 h-8 flex items-center justify-center text-base-content hover:bg-base-200 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Sepet Özeti ve Butonlar */}
          {cartItems.length > 0 && !orderSuccess && (
            <div className="border-t border-base-200 p-4 bg-base-100">
              <div className="flex justify-between mb-2">
                <span className="text-base-content">Zwischensumme:</span>
                <span className="font-medium text-base-content">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span className="text-base-content">Gesamt:</span>
                <span className="text-primary">{totalPrice.toFixed(2)} €</span>
              </div>
              
              {isCheckout ? (
                <div className="space-y-3">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={!userInfo.name || !userInfo.email || !userInfo.phone || !userInfo.address}
                    className="w-full py-3 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bestellung abschließen
                  </button>
                  <button 
                    onClick={() => setIsCheckout(false)}
                    className="w-full py-2 border border-base-300 text-base-content rounded-md hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    Zurück zum Warenkorb
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors cursor-pointer"
                  >
                    Bestellen
                  </button>
                  <button 
                    onClick={toggleCart}
                    className="w-full py-2 border border-base-300 text-base-content rounded-md hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    Einkauf fortsetzen
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart; 