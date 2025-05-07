import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';

const AdminOrderManager = () => {
  const { orders, updateOrderStatus, ORDER_STATUS } = useOrder();
  const [activeStatus, setActiveStatus] = useState(ORDER_STATUS.PENDING);
  const [orderDetail, setOrderDetail] = useState(null);
  
  // Duruma göre filtrelenmiş siparişler
  const filteredOrders = orders.filter(order => order.status === activeStatus);
  
  // Sipariş detayını göster
  const showOrderDetail = (order) => {
    setOrderDetail(order);
  };
  
  // Sipariş detayını kapat
  const closeOrderDetail = () => {
    setOrderDetail(null);
  };
  
  // Sipariş durumunu güncelle
  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    
    // Eğer detay açıksa ve durumu değiştirilen sipariş buysa, detayı kapat
    if (orderDetail && orderDetail.id === orderId) {
      setOrderDetail(null);
    }
  };
  
  // Duruma göre stil sınıfları
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'bg-warning text-warning-content';
      case ORDER_STATUS.CONFIRMED:
        return 'bg-info text-info-content';
      case ORDER_STATUS.DELIVERED:
        return 'bg-success text-success-content';
      case ORDER_STATUS.CANCELLED:
        return 'bg-error text-error-content';
      default:
        return 'bg-base-300 text-base-content';
    }
  };
  
  // Tarihi formatla
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bestellungsverwaltung</h2>
      
      {/* Durum filtreleri */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.values(ORDER_STATUS).map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
              activeStatus === status 
                ? 'bg-primary text-primary-content' 
                : 'bg-base-200 text-base-content hover:bg-base-300'
            }`}
          >
            {status === ORDER_STATUS.PENDING && 'Ausstehend'}
            {status === ORDER_STATUS.CONFIRMED && 'Bestätigt'}
            {status === ORDER_STATUS.DELIVERED && 'Geliefert'}
            {status === ORDER_STATUS.CANCELLED && 'Storniert'}
          </button>
        ))}
      </div>
      
      {/* Sipariş listesi */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-base-content/60">
            Keine Bestellungen in diesem Status vorhanden.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-base-200">
                <th className="px-4 py-3 text-left">Bestellnr.</th>
                <th className="px-4 py-3 text-left">Datum</th>
                <th className="px-4 py-3 text-left">Kunde</th>
                <th className="px-4 py-3 text-left">Betrag</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-base-200 hover:bg-base-100/50">
                  <td className="px-4 py-3">{order.id.split('-')[1]}</td>
                  <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">{order.userInfo.name}</td>
                  <td className="px-4 py-3">{order.totalAmount.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                      {order.status === ORDER_STATUS.PENDING && 'Ausstehend'}
                      {order.status === ORDER_STATUS.CONFIRMED && 'Bestätigt'}
                      {order.status === ORDER_STATUS.DELIVERED && 'Geliefert'}
                      {order.status === ORDER_STATUS.CANCELLED && 'Storniert'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => showOrderDetail(order)}
                        className="px-3 py-1 bg-base-300 hover:bg-base-400 rounded-md text-xs cursor-pointer"
                      >
                        Details
                      </button>
                      
                      {order.status === ORDER_STATUS.PENDING && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CONFIRMED)}
                          className="px-3 py-1 bg-success hover:bg-success-focus text-success-content rounded-md text-xs cursor-pointer"
                        >
                          Bestätigen
                        </button>
                      )}
                      
                      {order.status === ORDER_STATUS.CONFIRMED && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.DELIVERED)}
                          className="px-3 py-1 bg-info hover:bg-info-focus text-info-content rounded-md text-xs cursor-pointer"
                        >
                          Als geliefert markieren
                        </button>
                      )}
                      
                      {order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.DELIVERED && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CANCELLED)}
                          className="px-3 py-1 bg-error hover:bg-error-focus text-error-content rounded-md text-xs cursor-pointer"
                        >
                          Stornieren
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Sipariş detay modal */}
      {orderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeOrderDetail}></div>
          <div className="bg-base-100 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Bestelldetails #{orderDetail.id.split('-')[1]}</h3>
              <button onClick={closeOrderDetail} className="text-base-content cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold mb-2">Kundeninformationen</h4>
                <p className="mb-1"><span className="font-medium">Name:</span> {orderDetail.userInfo.name}</p>
                <p className="mb-1"><span className="font-medium">E-Mail:</span> {orderDetail.userInfo.email}</p>
                <p className="mb-1"><span className="font-medium">Telefon:</span> {orderDetail.userInfo.phone}</p>
                <p className="mb-1"><span className="font-medium">Adresse:</span> {orderDetail.userInfo.address}</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Bestellinformationen</h4>
                <p className="mb-1">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(orderDetail.status)}`}>
                    {orderDetail.status === ORDER_STATUS.PENDING && 'Ausstehend'}
                    {orderDetail.status === ORDER_STATUS.CONFIRMED && 'Bestätigt'}
                    {orderDetail.status === ORDER_STATUS.DELIVERED && 'Geliefert'}
                    {orderDetail.status === ORDER_STATUS.CANCELLED && 'Storniert'}
                  </span>
                </p>
                <p className="mb-1"><span className="font-medium">Bestelldatum:</span> {formatDate(orderDetail.createdAt)}</p>
                <p className="mb-1"><span className="font-medium">Letzte Aktualisierung:</span> {formatDate(orderDetail.updatedAt)}</p>
                <p className="mb-1"><span className="font-medium">Gesamtbetrag:</span> {orderDetail.totalAmount.toFixed(2)} €</p>
              </div>
            </div>
            
            <h4 className="font-bold mb-3">Bestellte Produkte</h4>
            <table className="w-full mb-6">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-2 text-left">Produkt</th>
                  <th className="px-4 py-2 text-right">Menge</th>
                  <th className="px-4 py-2 text-right">Einzelpreis</th>
                  <th className="px-4 py-2 text-right">Gesamt</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.items.map((item, index) => (
                  <tr key={index} className="border-b border-base-200">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 bg-base-200 rounded overflow-hidden">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">{item.price.toFixed(2)} €</td>
                    <td className="px-4 py-2 text-right">{(item.price * item.quantity).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h4 className="font-bold mb-3">Statusverlauf</h4>
            <ul className="space-y-2 mb-6">
              {orderDetail.statusHistory.map((history, index) => (
                <li key={index} className="flex items-start">
                  <div className={`w-3 h-3 mt-1.5 rounded-full mr-3 ${getStatusBadgeClass(history.status)}`}></div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {history.status === ORDER_STATUS.PENDING && 'Ausstehend'}
                        {history.status === ORDER_STATUS.CONFIRMED && 'Bestätigt'}
                        {history.status === ORDER_STATUS.DELIVERED && 'Geliefert'}
                        {history.status === ORDER_STATUS.CANCELLED && 'Storniert'}
                      </span>
                      <span className="text-sm text-base-content/60">{formatDate(history.date)}</span>
                    </div>
                    {history.note && <p className="text-sm">{history.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-end gap-3 mt-3">
              {orderDetail.status === ORDER_STATUS.PENDING && (
                <button 
                  onClick={() => handleUpdateStatus(orderDetail.id, ORDER_STATUS.CONFIRMED)}
                  className="px-4 py-2 bg-success hover:bg-success-focus text-success-content rounded-md cursor-pointer"
                >
                  Bestellung bestätigen
                </button>
              )}
              
              {orderDetail.status === ORDER_STATUS.CONFIRMED && (
                <button 
                  onClick={() => handleUpdateStatus(orderDetail.id, ORDER_STATUS.DELIVERED)}
                  className="px-4 py-2 bg-info hover:bg-info-focus text-info-content rounded-md cursor-pointer"
                >
                  Als geliefert markieren
                </button>
              )}
              
              {orderDetail.status !== ORDER_STATUS.CANCELLED && orderDetail.status !== ORDER_STATUS.DELIVERED && (
                <button 
                  onClick={() => handleUpdateStatus(orderDetail.id, ORDER_STATUS.CANCELLED)}
                  className="px-4 py-2 bg-error hover:bg-error-focus text-error-content rounded-md cursor-pointer"
                >
                  Bestellung stornieren
                </button>
              )}
              
              <button 
                onClick={closeOrderDetail}
                className="px-4 py-2 bg-base-300 hover:bg-base-400 rounded-md cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManager; 