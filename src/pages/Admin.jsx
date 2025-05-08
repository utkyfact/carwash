import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import AdminSliderManager from '../components/AdminSliderManager';
import AdminPackageManager from '../components/AdminPackageManager';
import AdminProductManager from '../components/AdminProductManager';
import AdminOrderManager from '../components/AdminOrderManager';
import AdminTodoManager from '../components/AdminTodoManager';
import AdminAppointmentManager from '../components/AdminAppointmentManager';
import AdminAboutManager from '../components/AdminAboutManager';
import AdminDashboard from '../components/AdminDashboard';
import AdminEmployeeManager from '../components/AdminEmployeeManager';
import AdminCustomerManager from '../components/AdminCustomerManager';
import AdminMarketingManager from '../components/AdminMarketingManager';
import AdminInventoryManager from '../components/AdminInventoryManager';
import AdminWeatherManager from '../components/AdminWeatherManager';
import ConfirmationModal from '../components/ConfirmationModal';

// Renkler için seçenekler
const colorOptions = [
  { value: 'bg-primary', label: 'Primary' },
  { value: 'bg-secondary', label: 'Secondary' },
  { value: 'bg-accent', label: 'Accent' },
  { value: 'bg-info', label: 'Info' },
  { value: 'bg-success', label: 'Success' },
  { value: 'bg-warning', label: 'Warning' },
  { value: 'bg-error', label: 'Error' },
  { value: 'bg-neutral', label: 'Neutral' },
];

const defaultPackage = {
  id: '',
  name: '',
  price: '',
  features: [''],
  color: 'bg-primary',
};

const Admin = ({ isAuthenticated, setIsAuthenticated, onNavigateHome }) => {
  const { washPackages, updatePackage, addPackage, deletePackage, resetData } = useData();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [editMode, setEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(defaultPackage);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'employees', 'customers', 'marketing', 'inventory', 'weather', 'appointments', 'orders', 'packages', 'sliders', 'products', 'todos', 'about'
  const [resetModal, setResetModal] = useState({ isOpen: false });
  
  // Admin girişi yap
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Demo için basit bir kimlik doğrulama
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Benutzername oder Passwort falsch!');
    }
  };
  
  // Çıkış yap
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    onNavigateHome();
  };
  
  // Paket düzenleme moduna geç
  const handleEditPackage = (pkg) => {
    setCurrentPackage({...pkg, features: [...pkg.features]});
    setEditMode(true);
    setIsNewPackage(false);
  };
  
  // Yeni paket ekleme moduna geç
  const handleAddPackage = () => {
    setCurrentPackage({
      ...defaultPackage,
      id: `package-${Date.now()}`, // Benzersiz ID oluştur
    });
    setEditMode(true);
    setIsNewPackage(true);
  };
  
  // Paket silme onayı
  const confirmDeletePackage = (packageId) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Paket löschen möchten?')) {
      deletePackage(packageId);
    }
  };
  
  // Input değişikliklerini takip et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Özellik ekleme/silme/düzenleme
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...currentPackage.features];
    updatedFeatures[index] = value;
    setCurrentPackage(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };
  
  const addFeature = () => {
    setCurrentPackage(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };
  
  const removeFeature = (index) => {
    const updatedFeatures = [...currentPackage.features];
    updatedFeatures.splice(index, 1);
    setCurrentPackage(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };
  
  // Formu kaydet
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Boş özellikleri temizle
    const cleanedFeatures = currentPackage.features.filter(feature => feature.trim() !== '');
    
    const updatedPackage = {
      ...currentPackage,
      features: cleanedFeatures
    };
    
    if (isNewPackage) {
      addPackage(updatedPackage);
    } else {
      updatePackage(currentPackage.id, updatedPackage);
    }
    
    setEditMode(false);
    setCurrentPackage(defaultPackage);
  };
  
  // Verileri sıfırla modalını aç
  const openResetModal = () => {
    setResetModal({ isOpen: true });
  };

  // Verileri sıfırla modalını kapat
  const closeResetModal = () => {
    setResetModal({ isOpen: false });
  };

  // Verileri sıfırla işlemini gerçekleştir
  const handleResetData = () => {
    resetData();
    closeResetModal();
  };
  
  // Giriş formunu render et
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-1 md:px-4 py-16">
        <div className="max-w-md mx-auto bg-base-100 p-4 md:p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          
          {error && (
            <div className="bg-error/10 text-error p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-base-content font-medium mb-2">Benutzername</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-base-content font-medium mb-2">Passwort</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-primary-content font-medium py-2 px-4 rounded-md hover:bg-primary-focus transition-colors cursor-pointer"
            >
              Anmelden
            </button>
          </form>
          
          <div className="mt-4 text-center text-sm text-base-content/60">
            <p>Für Demo-Login: Benutzername "admin", Passwort "admin123"</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Ana admin paneli (tablolar ve yönetim)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Administrationsbereich</h1>
          <div className="flex space-x-4">
            <button
              onClick={openResetModal}
              className="py-2 px-4 border border-base-300 rounded-md text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            >
              Daten zurücksetzen
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-error rounded-md text-error-content hover:bg-error-focus transition-colors cursor-pointer"
            >
              Abmelden
            </button>
          </div>
        </div>
        
        {/* Tab menü */}
        <div className="border-b mb-6">
          <nav className="flex space-x-8 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'employees' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Mitarbeiter
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'customers' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Kunden
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'marketing' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Marketing
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'inventory' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Inventar
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'weather' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Wetter
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'appointments' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Termine
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'orders' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Bestellungen
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'packages' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Waschpakete
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'products' 
                  ? 'text-base-content' 
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Unsere Produkte
            </button>
            <button
              onClick={() => setActiveTab('sliders')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'sliders' 
                  ? 'text-base-content'
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Slider-Bilder
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'about' 
                  ? 'text-base-content'
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Über uns
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'todos' 
                  ? 'text-base-content'
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              Notizen
            </button>
          </nav>
        </div>
        
        {/* Tab içerikleri */}
        <div className="bg-base-100 rounded-lg p-2 md:p-6 shadow-md">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'employees' && <AdminEmployeeManager />}
          {activeTab === 'customers' && <AdminCustomerManager />}
          {activeTab === 'marketing' && <AdminMarketingManager />}
          {activeTab === 'inventory' && <AdminInventoryManager />}
          {activeTab === 'weather' && <AdminWeatherManager />}
          {activeTab === 'appointments' && <AdminAppointmentManager />}
          {activeTab === 'orders' && <AdminOrderManager />}
          {activeTab === 'packages' && <AdminPackageManager />}
          {activeTab === 'sliders' && <AdminSliderManager />}
          {activeTab === 'products' && <AdminProductManager />}
          {activeTab === 'todos' && <AdminTodoManager />}
          {activeTab === 'about' && <AdminAboutManager />}
        </div>
        
      </div>

      {/* Onay Modalı - Verileri Sıfırlama */}
      <ConfirmationModal
        isOpen={resetModal.isOpen}
        onClose={closeResetModal}
        onConfirm={handleResetData}
        title="Daten zurücksetzen"
        message="Sind Sie sicher, dass Sie alle Daten zurücksetzen möchten? Diese Aktion kann nicht rückgängig gemacht werden!"
        confirmButtonText="Zurücksetzen"
        cancelButtonText="Abbrechen"
        icon="error"
      />
    </div>
  );
};

export default Admin; 