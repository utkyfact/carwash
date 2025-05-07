import React, { createContext, useState, useContext, useEffect } from 'react';

// Context oluştur
const CartContext = createContext();

// LocalStorage anahtar
const STORAGE_KEY = 'carwash_cart';

// Context provider bileşeni
export const CartProvider = ({ children }) => {
  // State tanımları
  const [cartItems, setCartItems] = useState(() => {
    // Eğer localStorage'da veri varsa onu kullan, yoksa boş dizi kullan
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("LocalStorage verisi ayrıştırılamadı:", error);
        return [];
      }
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Veri değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Toplam ürün adedi
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Toplam tutar
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Sepete ürün ekleme
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Benzersiz zaman damgası ekle
      const addedAt = Date.now();
      
      // Yoksa yeni ürün olarak ekle
      return [...prevItems, { ...product, quantity, addedAt }];
    });
    
    // Sepeti aç
    setIsCartOpen(true);
  };
  
  // Sepetten ürün çıkarma
  const removeFromCart = (productId, addedAt) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === productId && item.addedAt === addedAt)
    ));
  };
  
  // Ürün adetini güncelleme
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Sepeti boşaltma
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Sepeti aç/kapat
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  // Ürün adetini artırma
  const increaseQuantity = (productId, addedAt) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === productId && item.addedAt === addedAt) ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  // Ürün adetini azaltma
  const decreaseQuantity = (productId, addedAt) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId && item.addedAt === addedAt) {
          const newQuantity = item.quantity - 1;
          return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean)
    );
  };
  
  // Provider değerleri
  const value = {
    cartItems,
    totalItems,
    totalPrice,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    setIsCartOpen,
    increaseQuantity,
    decreaseQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Context hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart hook, CartProvider içinde kullanılmalıdır');
  }
  return context;
};

export default CartContext; 