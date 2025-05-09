import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAppointment } from '../context/AppointmentContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';

// Waschpakete (Gleiche Daten wie auf der Startseite) - Hinweis: Diese Daten kommen jetzt aus dem DataContext
const washPackages = [
  {
    id: 'standard',
    name: 'STANDARD',
    price: '11',
    features: ['Außenwäsche', 'Schaumreinigung', 'Felgenreinigung', 'Trocknung'],
    color: 'bg-primary',
  },
  {
    id: 'classic',
    name: 'CLASSIC',
    price: '14',
    features: ['Standard-Paket inklusive', 'Innenreinigung', 'Armaturenbrettreinigung', 'Glasreinigung'],
    color: 'bg-secondary',
  },
  {
    id: 'spezial',
    name: 'SPEZIAL',
    price: '15',
    features: ['Classic-Paket inklusive', 'Dachreinigung', 'Sitzreinigung', 'Zusätzliche Politur'],
    color: 'bg-accent',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '18',
    features: ['Spezial-Paket inklusive', 'Detaillierte Innenreinigung', 'Motorraumreinigung', 'Spezieller Schutzlack'],
    color: 'bg-info',
  },
];

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

const Booking = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { washPackages } = useData();
  const { createAppointment } = useAppointment();
  const { cartItems, totalPrice: cartTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrder();
  const selectedPackage = washPackages.find(pkg => pkg.id === packageId) || washPackages[0];
  const datePickerRef = useRef(null);
  
  const availableTimes = generateAvailableTimes();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    date: '',
    time: '',
    paymentMethod: 'credit',
    agreeTerms: false,
    includeCartItems: cartItems.length > 0, // Sepet ürünlerini dahil etme seçeneği
  });
  
  // Toplam fiyat hesaplama (paket + sepet ürünleri)
  const totalPrice = parseFloat(selectedPackage.price) + (formData.includeCartItems ? cartTotalPrice : 0);
  
  // Fehlermeldungen
  const [errors, setErrors] = useState({});
  // Wurde das Formular abgeschickt?
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Fehlermeldung für das eingegebene Feld löschen
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonnummer ist erforderlich';
    }
    
    if (!formData.carModel.trim()) {
      newErrors.carModel = 'Fahrzeugmodell ist erforderlich';
    }
    
    if (!formData.date) {
      newErrors.date = 'Bitte wählen Sie ein Datum aus';
    }
    
    if (!formData.time) {
      newErrors.time = 'Bitte wählen Sie eine Uhrzeit aus';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Sie müssen die Bedingungen akzeptieren';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Termin ile AppointmentContext üzerinden randevu oluştur
    createAppointment(formData, selectedPackage.id);
    
    // Eğer sepet ürünleri dahil edilecekse, sipariş oluştur
    if (formData.includeCartItems && cartItems.length > 0) {
      const userInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.carModel, // Adres bilgisi olmadığı için araç modelini kullanıyoruz
      };
      
      createOrder(cartItems, userInfo, cartTotalPrice);
      
      // Sepeti temizle
      clearCart();
    }
    
    // Formular erfolgreich abgeschickt
    setIsSubmitted(true);
    
    // Nach 3 Sekunden zur Startseite weiterleiten
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };
  
  // Date picker outside click handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        // Takvim dışına tıklandığında açık kalmasını önle
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
  
  // Wenn das Formular erfolgreich abgeschickt wurde, zeige eine Dankesnachricht
  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto bg-base-100 p-8 rounded-lg shadow-lg text-center">
          <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-base-content mb-2">Ihr Termin wurde erstellt!</h2>
          <p className="text-base-content/70 mb-6">
            Wir haben die Termindetails an Ihre E-Mail-Adresse gesendet. Wir erwarten Sie zum vereinbarten Waschtermin.
          </p>
          <p className="text-sm text-base-content/60">Sie werden zur Startseite weitergeleitet...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Waschtermin</h1>
        
        <div className="bg-base-100 shadow-md rounded-lg overflow-hidden mb-8">
          <div className={`${selectedPackage.color} py-4 px-6`}>
            <h2 className="text-xl font-bold">Ausgewähltes Paket: {selectedPackage.name}</h2>
            <p className="text-2xl font-bold mt-1">{selectedPackage.price} €</p>
          </div>
          
          <div className="p-6">
            <h3 className="font-medium mb-2">Paketmerkmale:</h3>
            <ul className="space-y-2 mb-4">
              {selectedPackage.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-5 h-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Sepet Ürünleri (Eğer varsa) */}
        {cartItems.length > 0 && (
          <div className="bg-base-100 shadow-md rounded-lg overflow-hidden mb-8">
            <div className="bg-secondary py-4 px-6">
              <h2 className="text-xl font-bold text-secondary-content">Warenkorb Produkte</h2>
              <p className="text-secondary-content mt-1">Gesamtsumme: {cartTotalPrice.toFixed(2)} €</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="includeCartItems"
                  name="includeCartItems"
                  checked={formData.includeCartItems}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      includeCartItems: e.target.checked
                    }));
                  }}
                  className="w-4 h-4 text-primary cursor-pointer"
                />
                <label htmlFor="includeCartItems" className="ml-2 text-base-content cursor-pointer">
                  Warenkorb zum Termin hinzufügen
                </label>
              </div>
              
              {formData.includeCartItems && (
                <div className="space-y-3 mb-4">
                  <h3 className="font-medium mb-2">Warenkorb Produkte:</h3>
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-base-200 pb-2">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded-md mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50';
                          }}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-base-content/70">{item.quantity} x {item.price.toFixed(2)} €</p>
                        </div>
                      </div>
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-base-100 shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Persönliche Daten und Termin</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-base-content font-medium mb-2">Name und Nachname</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-error' : 'border-base-300'}`}
                    placeholder="Name und Nachname"
                  />
                  {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-base-content font-medium mb-2">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-error' : 'border-base-300'}`}
                    placeholder="beispiel@email.com"
                  />
                  {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-base-content font-medium mb-2">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-error' : 'border-base-300'}`}
                    placeholder="+49 XXX XXX XXXX"
                  />
                  {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="carModel" className="block text-base-content font-medium mb-2">Fahrzeugmodell</label>
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.carModel ? 'border-error' : 'border-base-300'}`}
                    placeholder="Marke und Modell"
                  />
                  {errors.carModel && <p className="text-error text-sm mt-1">{errors.carModel}</p>}
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-base-content font-medium mb-2">Datum</label>
                  <div className="relative date-input-container" ref={datePickerRef}>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary date-input ${errors.date ? 'border-error' : 'border-base-300'}`}
                      autoComplete="off"
                      onClick={(e) => {
                        // Takvimin açılmasını sağla 
                        e.currentTarget.showPicker();
                      }}
                      onTouchEnd={(e) => {
                        // Mobil için ek destek
                        e.preventDefault();
                        e.currentTarget.showPicker();
                      }}
                    />
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                      aria-hidden="true"
                    >
                      <svg className="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.date && <p className="text-error text-sm mt-1">{errors.date}</p>}
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-base-content font-medium mb-2">Uhrzeit</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${errors.time ? 'border-error' : 'border-base-300'}`}
                  >
                    <option className="text-base-content bg-base-100" value="">Uhrzeit wählen</option>
                    {availableTimes.map(time => (
                      <option className="text-base-content bg-base-100" key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-error text-sm mt-1">{errors.time}</p>}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={`w-4 h-4 mt-1 text-primary cursor-pointer ${errors.agreeTerms ? 'border-error' : ''}`}
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-base-content cursor-pointer">
                    Ich stimme der Verarbeitung meiner persönlichen Daten und den Nutzungsbedingungen zu
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-error text-sm mt-1">{errors.agreeTerms}</p>}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                  Gesamt: {totalPrice.toFixed(2)} €
                </div>
                <button
                  type="submit"
                  className={`py-3 px-8 rounded-md font-medium cursor-pointer ${selectedPackage.color} hover:opacity-90 transition-opacity`}
                >
                  Termin bestätigen
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 