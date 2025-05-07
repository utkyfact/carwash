import React, { createContext, useState, useContext, useEffect } from 'react';
import { useData } from './DataContext';

// Context oluştur
const OrderContext = createContext();

// LocalStorage anahtar
const STORAGE_KEY = 'carwash_orders';

// Sipariş durumları
export const ORDER_STATUS = {
  PENDING: 'pending',       // Onay bekliyor
  CONFIRMED: 'confirmed',   // Onaylandı
  DELIVERED: 'delivered',   // Teslim edildi
  CANCELLED: 'cancelled'    // İptal edildi
};

// Context provider bileşeni
export const OrderProvider = ({ children }) => {
  const { productData, updateProduct } = useData();
  
  // State tanımları
  const [orders, setOrders] = useState(() => {
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
  
  // Veri değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);
  
  // Yeni sipariş oluşturma
  const createOrder = (cartItems, userInfo, totalAmount) => {
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
    
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder.id;
  };
  
  // Sipariş durumunu güncelleme
  const updateOrderStatus = (orderId, newStatus, note = '') => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Sipariş teslimat durumuna geçtiğinde stoktan düş
          if (newStatus === ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.DELIVERED) {
            // Her bir ürün için stok düşümü yap
            order.items.forEach(item => {
              const product = productData.find(p => p.id === item.id);
              if (product && product.stock) {
                updateProduct(product.id, {
                  ...product,
                  stock: Math.max(0, product.stock - item.quantity)
                });
              }
            });
          }
          
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
      })
    );
  };
  
  // Siparişi silme/iptal etme
  const cancelOrder = (orderId, note = 'Sipariş iptal edildi') => {
    updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, note);
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
  
  // Provider değerleri
  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    cancelOrder,
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

// Context hook
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder hook, OrderProvider içinde kullanılmalıdır');
  }
  return context;
};

export default OrderContext; 