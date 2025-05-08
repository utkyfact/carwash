import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import ConfirmationModal from './ConfirmationModal';

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

const AdminPackageManager = () => {
  const { washPackages, updatePackage, addPackage, deletePackage } = useData();
  
  const [editMode, setEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(defaultPackage);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, packageId: null });
  
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
  
  // Silme modalını aç
  const openDeleteModal = (packageId) => {
    setDeleteModal({ isOpen: true, packageId });
  };

  // Silme modalını kapat
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, packageId: null });
  };

  // Paket silme işlemini gerçekleştir
  const handleDeletePackage = () => {
    if (deleteModal.packageId) {
      deletePackage(deleteModal.packageId);
      closeDeleteModal();
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

  // Düzenleme formunu render et
  if (editMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {isNewPackage ? 'Neues Waschpaket hinzufügen' : 'Waschpaket bearbeiten'}
            </h1>
            <button
              onClick={() => setEditMode(false)}
              className="text-base-content/70 hover:text-base-content"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="id" className="block text-base-content font-medium mb-2">ID (Eindeutige Kennung)</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={currentPackage.id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="z.B. standard, premium, usw."
                  required
                  disabled={!isNewPackage} // Die ID bestehender Pakete kann nicht geändert werden
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-base-content font-medium mb-2">Paketname</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentPackage.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="z.B. STANDARD, PREMIUM"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-base-content font-medium mb-2">Preis (€)</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={currentPackage.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="z.B. 11, 15.99"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-base-content font-medium mb-2">Farbe</label>
                <select
                  id="color"
                  name="color"
                  value={currentPackage.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base-content font-medium">Merkmale</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center text-primary hover:text-primary-focus"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Merkmal hinzufügen
                </button>
              </div>
              
              {currentPackage.features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Merkmal ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-error hover:text-error-focus"
                    disabled={currentPackage.features.length <= 1} // Mindestens 1 Merkmal erforderlich
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="py-2 px-4 border border-base-300 rounded-md text-base-content hover:bg-base-200 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-primary rounded-md text-primary-content hover:bg-primary-focus transition-colors"
              >
                Speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Paketliste rendern
  return (
    <div className="bg-base-100 rounded-lg overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-b gap-4">
        <h2 className="text-md md:text-xl font-semibold">Waschpakete</h2>
        <button
          onClick={handleAddPackage}
          className="flex items-center py-1 md:py-2 px-2 md:px-4 bg-success rounded-md text-success-content hover:bg-success-focus transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neues Paket hinzufügen
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Paketname</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Preis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Farbe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">Merkmale</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-base-content/60 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {washPackages.map(pkg => (
              <tr key={pkg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">{pkg.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/70">{pkg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/70">{pkg.price} €</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`h-8 w-8 rounded-full ${pkg.color}`}></div>
                </td>
                <td className="px-6 py-4 text-sm text-base-content/70">
                  <div className="max-h-20 overflow-y-auto">
                    <ul className="list-disc list-inside">
                      {pkg.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditPackage(pkg)}
                    className="text-primary hover:text-primary-focus mr-4 cursor-pointer"
                  >
                    Bearbeiten
                  </button>
                  <button 
                    onClick={() => openDeleteModal(pkg.id)}
                    className="text-error hover:text-error-focus cursor-pointer"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Onay Modalı */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeletePackage}
        title="Paket löschen"
        message="Sind Sie sicher, dass Sie dieses Paket löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmButtonText="Löschen"
        cancelButtonText="Abbrechen"
        icon="warning"
      />
    </div>
  );
};

export default AdminPackageManager; 