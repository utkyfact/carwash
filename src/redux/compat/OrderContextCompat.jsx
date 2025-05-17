import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createOrder, 
  updateOrderStatus, 
  updateOrderStatusAsync, 
  cancelOrder, 
  selectAllOrders, 
  selectOrdersByStatus, 
  selectOrdersByUser, 
  ORDER_STATUS 
} from '../features/orderSlice';

// Backward compatibility context
const OrderContext = createContext();

// OrderProvider uyumluluk katmanı
export const OrderProvider = ({ children }) => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  
  // Redux actionları için wrapper fonksiyonlar
  const wrappedCreateOrder = (cartItems, userInfo, totalAmount) => {
    dispatch(createOrder({ cartItems, userInfo, totalAmount }));
    return `order-${Date.now()}`; // ID döndürmeye devam edebilmesi için
  };
  
  // Sipariş durumunu güncelle (async thunk kullanarak, stok güncellemesi içerir)
  const wrappedUpdateOrderStatus = (orderId, newStatus, note) => {
    dispatch(updateOrderStatusAsync({ orderId, newStatus, note }));
  };
  
  // Siparişi iptal et
  const wrappedCancelOrder = (orderId, note) => {
    dispatch(cancelOrder({ orderId, note }));
  };
  
  // Tüm siparişleri getir
  const getAllOrders = () => {
    return orders;
  };
  
  // Durum bazlı siparişleri getir
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };
  
  // Kullanıcı bazlı siparişleri getir
  const getOrdersByUser = (userId) => {
    return orders.filter(order => order.userInfo.userId === userId);
  };
  
  // Context value
  const value = {
    orders,
    createOrder: wrappedCreateOrder,
    updateOrderStatus: wrappedUpdateOrderStatus,
    cancelOrder: wrappedCancelOrder,
    getAllOrders,
    getOrdersByStatus,
    getOrdersByUser,
    ORDER_STATUS
  };
  
  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder hook, OrderProvider içinde kullanılmalıdır');
  }
  return context;
};

export default OrderContext; 