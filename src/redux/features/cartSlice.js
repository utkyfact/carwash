import { createSlice } from '@reduxjs/toolkit';

// LocalStorage anahtarı
const STORAGE_KEY = 'carwash_cart';

// LocalStorage'dan sepet verilerini yükle
const loadCartFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("LocalStorage verisi ayrıştırılamadı:", error);
  }
  return [];
};

// Başlangıç durumu
const initialState = {
  items: loadCartFromStorage(),
  isCartOpen: false
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      
      // Paket olmayan ürünler için adet artırma kontrolü
      if (product.type !== 'package') {
        const existingItemIndex = state.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          // Varolan ürünün adetini artır
          state.items[existingItemIndex].quantity += quantity;
          state.isCartOpen = true;
          return;
        }
      }
      
      // Yeni ürün olarak ekle
      state.items.push({ 
        ...product, 
        quantity,
        addedAt: Date.now() 
      });
      state.isCartOpen = true;
    },
    
    removeFromCart: (state, action) => {
      const { productId, addedAt } = action.payload;
      state.items = state.items.filter(
        item => !(item.id === productId && item.addedAt === addedAt)
      );
    },
    
    increaseQuantity: (state, action) => {
      const { productId, addedAt } = action.payload;
      
      const item = state.items.find(
        item => item.id === productId && item.addedAt === addedAt
      );
      
      if (item) {
        item.quantity += 1;
      }
    },
    
    decreaseQuantity: (state, action) => {
      const { productId, addedAt } = action.payload;
      
      const itemIndex = state.items.findIndex(
        item => item.id === productId && item.addedAt === addedAt
      );
      
      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          // Eğer adet 1'in altına düşerse ürünü kaldır
          state.items.splice(itemIndex, 1);
        }
      }
    },
    
    clearCart: (state) => {
      state.items = [];
    },
    
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    }
  },
});

// Sepet verilerini güncellemek için middleware
export const saveCartMiddleware = store => next => action => {
  const result = next(action);
  
  // Cart slice'ın actionları için localStorage'ı güncelle
  if (action.type.startsWith('cart/')) {
    const cartItems = store.getState().cart.items;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }
  
  return result;
};

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export const selectTotalItems = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

// Actions
export const { 
  addToCart, 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity,
  clearCart,
  toggleCart,
  setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer; 