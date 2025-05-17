import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateProduct } from './dataSlice';

// LocalStorage anahtar
const STORAGE_KEY = 'carwash_orders';

// Sipariş durumları
export const ORDER_STATUS = {
  PENDING: 'pending',       // Onay bekliyor
  CONFIRMED: 'confirmed',   // Onaylandı
  DELIVERED: 'delivered',   // Teslim edildi
  CANCELLED: 'cancelled'    // İptal edildi
};

// LocalStorage'dan veri yükleme
const loadOrdersFromStorage = () => {
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

// Initial state
const initialState = {
  orders: loadOrdersFromStorage()
};

// LocalStorage'a kaydetme yardımcı fonksiyonu
const saveOrdersToStorage = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

// Sipariş durumunu güncellerken stok da güncellemek için async thunk
export const updateOrderStatusAsync = createAsyncThunk(
  'orders/updateOrderStatusAsync',
  async ({ orderId, newStatus, note }, { dispatch, getState }) => {
    const { orders } = getState().orders;
    const { productData } = getState().data;
    
    const order = orders.find(o => o.id === orderId);
    
    // Eğer sipariş teslimat durumuna geçiyorsa stok güncelle
    if (newStatus === ORDER_STATUS.DELIVERED && order?.status !== ORDER_STATUS.DELIVERED) {
      order.items.forEach(item => {
        const product = productData.find(p => p.id === item.id);
        if (product && product.stock) {
          dispatch(updateProduct({
            productId: product.id,
            updatedData: {
              ...product,
              stock: Math.max(0, product.stock - item.quantity)
            }
          }));
        }
      });
    }
    
    return { orderId, newStatus, note };
  }
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Yeni sipariş oluşturma
    createOrder: (state, action) => {
      const { cartItems, userInfo, totalAmount } = action.payload;
      
      const newOrder = {
        id: `order-${Date.now()}`, // Benzersiz ID oluştur
        items: cartItems,
        userInfo,
        totalAmount,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: ORDER_STATUS.PENDING,
            date: new Date().toISOString(),
            note: 'Sipariş oluşturuldu'
          }
        ]
      };
      
      state.orders.unshift(newOrder);
      saveOrdersToStorage(state.orders);
    },
    
    // Sipariş durumunu güncelleme (basit güncelleme, stok güncellemesi olmadan)
    updateOrderStatus: (state, action) => {
      const { orderId, newStatus, note = '' } = action.payload;
      
      state.orders = state.orders.map(order => {
        if (order.id === orderId) {
          const now = new Date().toISOString();
          return {
            ...order,
            status: newStatus,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                date: now,
                note: note || `Sipariş durumu ${newStatus} olarak güncellendi`
              }
            ]
          };
        }
        return order;
      });
      
      saveOrdersToStorage(state.orders);
    },
    
    // Siparişi iptal etme
    cancelOrder: (state, action) => {
      const { orderId, note = 'Sipariş iptal edildi' } = action.payload;
      
      state.orders = state.orders.map(order => {
        if (order.id === orderId) {
          const now = new Date().toISOString();
          return {
            ...order,
            status: ORDER_STATUS.CANCELLED,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              {
                status: ORDER_STATUS.CANCELLED,
                date: now,
                note
              }
            ]
          };
        }
        return order;
      });
      
      saveOrdersToStorage(state.orders);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
      const { orderId, newStatus, note = '' } = action.payload;
      
      state.orders = state.orders.map(order => {
        if (order.id === orderId) {
          const now = new Date().toISOString();
          return {
            ...order,
            status: newStatus,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                date: now,
                note: note || `Sipariş durumu ${newStatus} olarak güncellendi`
              }
            ]
          };
        }
        return order;
      });
      
      saveOrdersToStorage(state.orders);
    });
  }
});

// Actions
export const { createOrder, updateOrderStatus, cancelOrder } = orderSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.orders;
export const selectOrdersByStatus = (status) => (state) => 
  state.orders.orders.filter(order => order.status === status);
export const selectOrdersByUser = (userId) => (state) => 
  state.orders.orders.filter(order => order.userInfo.userId === userId);

export default orderSlice.reducer; 