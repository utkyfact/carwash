import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  toggleCart,
  selectCartItems,
  selectIsCartOpen,
  selectTotalPrice
} from '../redux/features/cartSlice';
import { useOrder } from '../redux/compat/OrderContextCompat';
import { useData } from '../redux/compat/DataContextCompat';
import { useAppointment } from '../context/AppointmentContext';

// Verfügbare Zeiten erstellen (9:00 - 19:00 Uhr, in 30-Minuten-Intervallen)
const generateAvailableTimes = () => {
  const times = [];
  const startHour = 9;
  const endHour = 19;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    times.push(`${hour}:00`);
    if (hour < endHour) {
      times.push(`${hour}:30`);
    }
  }
  
  return times;
};

const Cart = () => {
  // Redux state ve actions
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const totalPrice = useSelector(selectTotalPrice);
  
  const { createOrder } = useOrder();
  const { createAppointment } = useAppointment();
  const { washPackages } = useData();
  const availableTimes = generateAvailableTimes();
  
  // Kullanıcı bilgileri için state
  const [isCheckout, setIsCheckout] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showPackageSelect, setShowPackageSelect] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [existingPackageInCart, setExistingPackageInCart] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const datePickerRef = useRef(null);

  // Bugünün tarihini al (min değeri için)
  const today = new Date().toISOString().split('T')[0];

  // Sepette paket var mı kontrol et
  useEffect(() => {
    const packageItem = cartItems.find(item => item.type === 'package');
    setExistingPackageInCart(packageItem);
  }, [cartItems]);
  
  // Tarih seçimi dışına tıklandığında tarih seçiciyi kapatan listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        // Tarih seçici dışına tıklandığında input'u blur yapar
        const dateInput = datePickerRef.current.querySelector('input[type="date"]');
        if (dateInput) {
          dateInput.blur();
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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
  
  // Form verilerini sıfırla
  const resetForm = () => {
    setUserInfo({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };
  
  // Sipariş tamamlama
  const handlePlaceOrder = () => {
    // Paket ürünlerini ve normal ürünleri ayır
    const packageItems = cartItems.filter(item => item.type === 'package');
    
    // Önce sipariş oluştur
    createOrder(cartItems, userInfo, totalPrice);
    
    // Paket ürünlerini randevu olarak ekle (setTimeout içinde çalıştırarak render döngüsünden çıkar)
    setTimeout(() => {
      packageItems.forEach(packageItem => {
        const packageData = {
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          carModel: "Sipariş üzerinden eklendi", // Araç modeli bilgisi olmadığı için varsayılan bir değer
          date: packageItem.appointmentDate,
          time: packageItem.appointmentTime,
          agreeTerms: true
        };
        
        // Randevu oluştur
        createAppointment(packageData, packageItem.id);
      });
    }, 0);
    
    // Sepeti temizle ve başarılı mesajını göster
    dispatch(clearCart());
    setIsCheckout(false);
    setOrderSuccess(true);
    
    // Form verilerini sıfırla
    resetForm();
    
    // 3 saniye sonra başarılı mesajını kapat
    setTimeout(() => {
      setOrderSuccess(false);
      dispatch(toggleCart());
    }, 3000);
  };

  // Paket select'i göster/gizle
  const togglePackageSelect = () => {
    if (!existingPackageInCart) {
      setShowPackageSelect(!showPackageSelect);
    }
  };

  // Sepeti aç/kapat
  const handleToggleCart = () => {
    dispatch(toggleCart());
  };

  // Paket seçimi değiştiğinde
  const handlePackageChange = (e) => {
    setSelectedPackageId(e.target.value);
  };

  // Tarih değiştiğinde
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Saat değiştiğinde
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // Sepete paket eklemek için gerekli kontrol
  const isPackageFormValid = () => {
    return selectedPackageId && selectedDate && selectedTime;
  };

  // Paketi sepete ekle
  const handleAddPackageToCart = () => {
    if (!isPackageFormValid()) return;
    
    const selectedPackage = washPackages.find(pkg => pkg.id === selectedPackageId);
    if (selectedPackage) {
      // Sepete eklenecek paket formatı
      const packageToAdd = {
        id: selectedPackage.id,
        name: `${selectedPackage.name} Paket`,
        price: parseFloat(selectedPackage.price),
        image: `https://placehold.co/200x200/3B82F6/FFFFFF/png?text=${selectedPackage.name}`, 
        type: 'package',
        features: selectedPackage.features,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime
      };
      
      dispatch(addToCart({ product: packageToAdd }));
      setSelectedPackageId('');
      setSelectedDate('');
      setSelectedTime('');
      setShowPackageSelect(false);
    }
  };

  // Sepette paket ekle kısmını kapat/aç
  const handleBackToPackageSelect = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedPackageId('');
  };
  
  // UI aşamalarını belirle
  const renderPackageSelectStep = () => {
    if (!selectedPackageId) {
      // Paket seçim aşaması
      return (
        <div>
          <label className="block text-base-content mb-2 text-sm">Paket auswählen</label>
          <select 
            value={selectedPackageId} 
            onChange={handlePackageChange}
            className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Bitte wählen</option>
            {washPackages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} - {pkg.price}€
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      // Tarih ve saat seçim aşaması
      return (
        <>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">{washPackages.find(pkg => pkg.id === selectedPackageId)?.name} Paket</h3>
            <button 
              onClick={handleBackToPackageSelect} 
              className="text-primary text-sm hover:underline cursor-pointer"
            >
              Paket değiştir
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Tarih Seçimi */}
            <div ref={datePickerRef} className="relative">
              <label className="block text-base-content mb-2 text-sm">Datum auswählen</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={handleDateChange}
                min={today}
                className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                onClick={(e) => {
                  // Tarih seçicinin kapanmasını önlemek için olayın yayılmasını durdurun
                  e.stopPropagation();
                }}
              />
            </div>
            
            {/* Saat Seçimi */}
            <div>
              <label className="block text-base-content mb-2 text-sm">Zeit auswählen</label>
              <select
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Bitte wählen</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      );
    }
  };
  
  return (
    <>
      {/* Karartma Arka Planı */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleToggleCart}
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
              onClick={handleToggleCart}
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
              {/* Paket Ekleme Bölümü */}
              {!isCheckout && (
                <div className="mb-4 border-b border-base-200 pb-4">
                  <div 
                    onClick={togglePackageSelect} 
                    className={`flex items-center justify-between ${existingPackageInCart ? 'text-base-300 cursor-not-allowed' : 'text-primary hover:text-primary-focus cursor-pointer'}`}
                  >
                    <span className="font-medium">
                      {existingPackageInCart 
                        ? `${existingPackageInCart.name} sepetinizde` 
                        : "Waschpaket hinzufügen"
                      }
                    </span>
                    {!existingPackageInCart && (
                      <svg className={`w-5 h-5 transition-transform ${showPackageSelect ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  
                  {showPackageSelect && !existingPackageInCart && (
                    <div className="mt-3 space-y-3">
                      {renderPackageSelectStep()}
                      
                      <button 
                        onClick={handleAddPackageToCart}
                        disabled={!isPackageFormValid()}
                        className="mt-2 w-full py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Zum Warenkorb hinzufügen
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="w-16 h-16 text-base-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-base-content mb-2">Ihr Warenkorb ist leer</p>
                  <button 
                    onClick={handleToggleCart}
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
                          src={item.type === 'package' 
                            ? `https://placehold.co/200x200/3B82F6/FFFFFF/png?text=${item.name.split(' ')[0]}` 
                            : item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/200x200/${item.type === 'package' ? '3B82F6' : '6366F1'}/FFFFFF/png?text=${item.name.split(' ')[0]}`;
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-base-content">{item.name}</h3>
                          <button 
                            onClick={() => dispatch(removeFromCart({ productId: item.id, addedAt: item.addedAt }))}
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
                        {item.type === 'package' && item.appointmentDate && item.appointmentTime && (
                          <p className="text-sm text-base-content/70 mt-1">
                            Termin: {new Date(item.appointmentDate).toLocaleDateString('de-DE')} - {item.appointmentTime} Uhr
                          </p>
                        )}
                        {item.type !== 'package' && (
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-base-content mr-2">Menge:</span>
                            <div className="flex items-center border border-base-300 rounded">
                              <button 
                                onClick={() => dispatch(decreaseQuantity({ productId: item.id, addedAt: item.addedAt }))}
                                className="w-8 h-8 flex items-center justify-center text-base-content hover:bg-base-200 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-base-content">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => dispatch(increaseQuantity({ productId: item.id, addedAt: item.addedAt }))}
                                className="w-8 h-8 flex items-center justify-center text-base-content hover:bg-base-200 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
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
                    onClick={handleToggleCart}
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