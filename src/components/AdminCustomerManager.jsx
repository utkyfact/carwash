import React, { useState, useEffect } from 'react';

// Demo müşteri verileri
const initialCustomers = [
  { id: 1, name: 'Klaus Schäfer', email: 'klaus@example.com', phone: '+49 123 45678', licensePlate: 'M-KS 123', carModel: 'BMW 3', loyalty: 'Gold', lastVisit: '2023-12-05', visits: 12 },
  { id: 2, name: 'Sabine Bauer', email: 'sabine@example.com', phone: '+49 234 56789', licensePlate: 'K-SB 456', carModel: 'VW Golf', loyalty: 'Silber', lastVisit: '2023-12-10', visits: 8 },
  { id: 3, name: 'Erich Hoffmann', email: 'erich@example.com', phone: '+49 345 67890', licensePlate: 'B-EH 789', carModel: 'Mercedes E-Klasse', loyalty: 'Bronze', lastVisit: '2023-11-28', visits: 4 },
  { id: 4, name: 'Monika Fischer', email: 'monika@example.com', phone: '+49 456 78901', licensePlate: 'F-MF 012', carModel: 'Audi A4', loyalty: 'Gold', lastVisit: '2023-12-08', visits: 15 },
  { id: 5, name: 'Jürgen Klein', email: 'jurgen@example.com', phone: '+49 567 89012', licensePlate: 'D-JK 345', carModel: 'Opel Astra', loyalty: 'Standard', lastVisit: '2023-11-15', visits: 2 }
];

// Sadakat seviyeleri
const loyaltyLevels = [
  { name: 'Standard', minVisits: 0, discount: 0 },
  { name: 'Bronze', minVisits: 3, discount: 5 },
  { name: 'Silber', minVisits: 5, discount: 10 },
  { name: 'Gold', minVisits: 10, discount: 15 }
];

const AdminCustomerManager = () => {
  const [customers, setCustomers] = useState(() => {
    // LocalStorage'dan müşteri verilerini yükle
    const savedCustomers = localStorage.getItem('carwash_customers');
    return savedCustomers ? JSON.parse(savedCustomers) : initialCustomers;
  });
  
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filterLoyalty, setFilterLoyalty] = useState('All');
  
  // Müşteri verilerini LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('carwash_customers', JSON.stringify(customers));
  }, [customers]);
  
  // Filtrelenmiş müşteriler
  const filteredCustomers = customers.filter(customer => 
    (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     customer.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterLoyalty === 'All' || customer.loyalty === filterLoyalty)
  );
  
  // Yeni müşteri ekle
  const handleAddCustomer = () => {
    setCurrentCustomer({
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      licensePlate: '',
      carModel: '',
      loyalty: 'Standard',
      lastVisit: new Date().toISOString().split('T')[0],
      visits: 0
    });
    setIsEditing(false);
    setShowForm(true);
  };
  
  // Müşteri düzenle
  const handleEditCustomer = (customer) => {
    setCurrentCustomer({...customer});
    setIsEditing(true);
    setShowForm(true);
  };
  
  // Müşteri sil
  const handleDeleteCustomer = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };
  
  // Form gönderildiğinde
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Sadakat seviyesini ziyaret sayısına göre güncelle
    const updatedLoyalty = getLoyaltyLevel(currentCustomer.visits);
    const updatedCustomer = {
      ...currentCustomer,
      loyalty: updatedLoyalty
    };
    
    if (isEditing) {
      // Mevcut müşteriyi güncelle
      setCustomers(customers.map(customer => 
        customer.id === currentCustomer.id ? updatedCustomer : customer
      ));
    } else {
      // Yeni müşteri ekle
      setCustomers([...customers, updatedCustomer]);
    }
    
    // Formu kapat ve değerleri sıfırla
    setShowForm(false);
    setCurrentCustomer(null);
  };
  
  // Input değişikliklerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({
      ...currentCustomer,
      [name]: value
    });
  };
  
  // Müşteri detaylarını göster
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowLoyalty(true);
  };
  
  // Ziyaret sayısına göre sadakat seviyesini belirle
  const getLoyaltyLevel = (visits) => {
    const level = loyaltyLevels
      .slice()
      .reverse()
      .find(level => visits >= level.minVisits);
    
    return level ? level.name : 'Standard';
  };
  
  // Sadakat seviyesine göre renk belirle
  const getLoyaltyColor = (loyalty) => {
    switch (loyalty) {
      case 'Gold': return 'text-yellow-500';
      case 'Silber': return 'text-gray-400';
      case 'Bronze': return 'text-amber-600';
      default: return '';
    }
  };
  
  // Sadakat seviyesine göre indirim oranını bul
  const getDiscountRate = (loyalty) => {
    const level = loyaltyLevels.find(level => level.name === loyalty);
    return level ? level.discount : 0;
  };
  
  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Kundenverwaltung</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Kunden suchen..."
              className="input input-bordered w-full max-w-xs pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            className="select select-bordered"
            value={filterLoyalty}
            onChange={(e) => setFilterLoyalty(e.target.value)}
          >
            <option value="All">Alle Treuekunden</option>
            {loyaltyLevels.map(level => (
              <option key={level.name} value={level.name}>{level.name}</option>
            ))}
          </select>
          
          <button 
            className="btn btn-primary" 
            onClick={handleAddCustomer}
          >
            Neuer Kunde
          </button>
        </div>
      </div>
      
      {/* Sadakat Seviyesi Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {loyaltyLevels.map(level => (
          <div key={level.name} className="bg-base-100 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`font-bold ${level.name === 'Gold' ? 'text-yellow-500' : level.name === 'Silber' ? 'text-gray-400' : level.name === 'Bronze' ? 'text-amber-600' : ''}`}>
                {level.name}
              </h3>
              <span className="badge badge-primary">{level.discount}% Rabatt</span>
            </div>
            <p className="text-sm opacity-70">Ab {level.minVisits} Besuchen</p>
          </div>
        ))}
      </div>
      
      {/* Müşteri formu */}
      {showForm && (
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Kunde bearbeiten' : 'Neuer Kunde'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={currentCustomer?.name || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">E-Mail</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={currentCustomer?.email || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Telefon</span>
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={currentCustomer?.phone || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kennzeichen</span>
                </label>
                <input 
                  type="text" 
                  name="licensePlate"
                  value={currentCustomer?.licensePlate || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Automodell</span>
                </label>
                <input 
                  type="text" 
                  name="carModel"
                  value={currentCustomer?.carModel || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Anzahl der Besuche</span>
                </label>
                <input 
                  type="number" 
                  name="visits"
                  value={currentCustomer?.visits || 0}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  min="0"
                  required
                />
              </div>
              
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Abbrechen
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                {isEditing ? 'Speichern' : 'Hinzufügen'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Sadakat Detayları Modalı */}
      {showLoyalty && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Treueprogrammdetails</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold">{selectedCustomer.name}</h4>
              <div className={`text-xl font-bold mb-2 ${getLoyaltyColor(selectedCustomer.loyalty)}`}>
                {selectedCustomer.loyalty} Mitglied
              </div>
              <p className="text-sm opacity-70">Kennzeichen: {selectedCustomer.licensePlate}</p>
              <p className="text-sm opacity-70">Automodell: {selectedCustomer.carModel}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-base-200 p-3 rounded-lg">
                <div className="text-sm opacity-70">Besuche</div>
                <div className="text-xl font-bold">{selectedCustomer.visits}</div>
              </div>
              <div className="bg-base-200 p-3 rounded-lg">
                <div className="text-sm opacity-70">Rabatt</div>
                <div className="text-xl font-bold">{getDiscountRate(selectedCustomer.loyalty)}%</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Besuchsverlauf</h4>
              <p>Letzter Besuch: {formatDate(selectedCustomer.lastVisit)}</p>
              
              {/* Buraya geçmiş işlemler eklenebilir */}
            </div>
            
            <div className="flex justify-between">
              <button 
                className="btn btn-outline"
                onClick={() => handleEditCustomer(selectedCustomer)}
              >
                Bearbeiten
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowLoyalty(false)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Müşteri listesi */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden md:table-cell">Kontakt</th>
              <th className="hidden lg:table-cell">Auto Details</th>
              <th>Treueprogramm</th>
              <th>Besuche</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span>{customer.phone}</span>
                      <span className="text-xs opacity-70">{customer.email}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="flex flex-col">
                      <span>{customer.licensePlate}</span>
                      <span className="text-xs opacity-70">{customer.carModel}</span>
                    </div>
                  </td>
                  <td>
                    <span className={getLoyaltyColor(customer.loyalty)}>{customer.loyalty}</span>
                  </td>
                  <td>{customer.visits}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewCustomer(customer)}
                        className="btn btn-square btn-sm btn-ghost"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEditCustomer(customer)}
                        className="btn btn-square btn-sm btn-ghost"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="btn btn-square btn-sm btn-ghost text-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Keine Kunden gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomerManager; 