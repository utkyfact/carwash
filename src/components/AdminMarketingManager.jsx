import React, { useState, useEffect } from 'react';

// Demo promosyon verileri
const initialPromotions = [
  { 
    id: 1, 
    name: 'Winterspezial', 
    code: 'WINTER23', 
    discount: 15, 
    description: 'Komplettwäsche mit Unterbodenschutz zum Sonderpreis', 
    startDate: '2023-12-01', 
    endDate: '2024-02-28',
    status: 'Aktiv'
  },
  { 
    id: 2, 
    name: 'Neukunden Rabatt', 
    code: 'NEWCUST', 
    discount: 20, 
    description: 'Rabatt für die erste Autowäsche bei uns', 
    startDate: '2023-11-01', 
    endDate: '2024-01-31',
    status: 'Aktiv'
  },
  { 
    id: 3, 
    name: 'Happy Monday', 
    code: 'MONDAY', 
    discount: 10, 
    description: 'Sparen Sie jeden Montag bei allen Waschprogrammen', 
    startDate: '2023-10-01', 
    endDate: '2023-11-30',
    status: 'Abgelaufen'
  },
  { 
    id: 4, 
    name: 'Sommeraktion', 
    code: 'SOMMER24', 
    discount: 15, 
    description: 'Spezielle Sommerangebote mit Insektenschutz', 
    startDate: '2024-06-01', 
    endDate: '2024-08-31',
    status: 'Geplant'
  }
];

const AdminMarketingManager = () => {
  const [promotions, setPromotions] = useState(() => {
    // LocalStorage'dan promosyon verilerini yükle
    const savedPromotions = localStorage.getItem('carwash_promotions');
    return savedPromotions ? JSON.parse(savedPromotions) : initialPromotions;
  });
  
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Promosyon verilerini LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('carwash_promotions', JSON.stringify(promotions));
  }, [promotions]);
  
  // Filtrelenmiş promosyonlar
  const filteredPromotions = promotions.filter(promo => 
    filterStatus === 'All' || promo.status === filterStatus
  );
  
  // Yeni promosyon ekle
  const handleAddPromotion = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setCurrentPromotion({
      id: Date.now(),
      name: '',
      code: '',
      discount: 10,
      description: '',
      startDate: today,
      endDate: today,
      status: 'Geplant'
    });
    
    setIsEditing(false);
    setShowForm(true);
  };
  
  // Promosyon düzenle
  const handleEditPromotion = (promotion) => {
    setCurrentPromotion({...promotion});
    setIsEditing(true);
    setShowForm(true);
  };
  
  // Promosyon sil
  const handleDeletePromotion = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Promotion löschen möchten?')) {
      setPromotions(promotions.filter(promo => promo.id !== id));
    }
  };
  
  // Form gönderildiğinde
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Promosyon durumunu tarih bilgisine göre güncelle
    const today = new Date();
    const startDate = new Date(currentPromotion.startDate);
    const endDate = new Date(currentPromotion.endDate);
    
    let status;
    if (endDate < today) {
      status = 'Abgelaufen';
    } else if (startDate <= today && endDate >= today) {
      status = 'Aktiv';
    } else {
      status = 'Geplant';
    }
    
    const updatedPromotion = {
      ...currentPromotion,
      status
    };
    
    if (isEditing) {
      // Mevcut promosyonu güncelle
      setPromotions(promotions.map(promo => 
        promo.id === currentPromotion.id ? updatedPromotion : promo
      ));
    } else {
      // Yeni promosyon ekle
      setPromotions([...promotions, updatedPromotion]);
    }
    
    // Formu kapat ve değerleri sıfırla
    setShowForm(false);
    setCurrentPromotion(null);
  };
  
  // Input değişikliklerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPromotion({
      ...currentPromotion,
      [name]: value
    });
  };
  
  // Duruma göre renk belirle
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'text-success';
      case 'Geplant': return 'text-info';
      case 'Abgelaufen': return 'text-error';
      default: return '';
    }
  };
  
  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Marketing & Promotions</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <select 
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Alle Promotionen</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Geplant">Geplant</option>
            <option value="Abgelaufen">Abgelaufen</option>
          </select>
          
          <button 
            className="btn btn-primary" 
            onClick={handleAddPromotion}
          >
            Neue Promotion
          </button>
        </div>
      </div>
      
      {/* Promosyon İstatistikleri */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Aktive Promotionen</div>
          <div className="stat-value text-success">
            {promotions.filter(p => p.status === 'Aktiv').length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Geplante Promotionen</div>
          <div className="stat-value text-info">
            {promotions.filter(p => p.status === 'Geplant').length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Abgelaufene Promotionen</div>
          <div className="stat-value text-error">
            {promotions.filter(p => p.status === 'Abgelaufen').length}
          </div>
        </div>
      </div>
      
      {/* Promosyon formu */}
      {showForm && (
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Promotion bearbeiten' : 'Neue Promotion'}
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
                  value={currentPromotion?.name || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Promotion-Code</span>
                </label>
                <input 
                  type="text" 
                  name="code"
                  value={currentPromotion?.code || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Rabatt (%)</span>
                </label>
                <input 
                  type="number" 
                  name="discount"
                  value={currentPromotion?.discount || 0}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Beschreibung</span>
                </label>
                <input 
                  type="text" 
                  name="description"
                  value={currentPromotion?.description || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Startdatum</span>
                </label>
                <input 
                  type="date" 
                  name="startDate"
                  value={currentPromotion?.startDate || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Enddatum</span>
                </label>
                <input 
                  type="date" 
                  name="endDate"
                  value={currentPromotion?.endDate || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  checked={currentPromotion?.emailNotify} 
                  onChange={() => setCurrentPromotion({
                    ...currentPromotion,
                    emailNotify: !currentPromotion.emailNotify
                  })}
                />
                <span className="label-text">E-Mail-Benachrichtigung an Kunden senden</span>
              </label>
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
      
      {/* Promosyon kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromotions.map(promotion => (
          <div key={promotion.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h3 className="card-title">{promotion.name}</h3>
                <span className={`badge ${getStatusColor(promotion.status)}`}>{promotion.status}</span>
              </div>
              
              <div className="my-2">
                <div className="badge badge-secondary badge-lg font-mono">{promotion.code}</div>
                <div className="badge badge-accent badge-lg ml-2">{promotion.discount}% Rabatt</div>
              </div>
              
              <p className="text-sm my-2">{promotion.description}</p>
              
              <div className="text-sm opacity-70">
                <div>Gültigkeit: {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</div>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleEditPromotion(promotion)}
                >
                  Bearbeiten
                </button>
                <button 
                  className="btn btn-sm btn-error"
                  onClick={() => handleDeletePromotion(promotion.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Yeni promosyon ekle kartı */}
        <div className="card bg-base-100 shadow-md border-2 border-dashed border-base-300">
          <div className="card-body flex items-center justify-center">
            <button 
              className="btn btn-ghost btn-lg text-base-content/60"
              onClick={handleAddPromotion}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Neue Promotion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketingManager; 