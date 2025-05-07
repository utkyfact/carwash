import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import ConfirmationModal from './ConfirmationModal';

const defaultProduct = {
  id: '',
  name: '',
  price: '',
  description: '',
  image: '',
  stock: 0,
  features: ['']
};

// UUID benzeri benzersiz kimlik oluşturucu fonksiyon
const generateUniqueId = () => {
  return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const AdminProductManager = () => {
  const { productData, updateProduct, addProduct, deleteProduct } = useData();
  
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(defaultProduct);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [imageError, setImageError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });
  
  // Resim URL'sini doğrulama fonksiyonu
  const validateImageURL = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  // Ürün düzenleme moduna geç
  const handleEditProduct = (product) => {
    setCurrentProduct({
      ...product, 
      features: product.features ? [...product.features] : ['']
    });
    setEditMode(true);
    setIsNewProduct(false);
    setImageError("");
  };
  
  // Yeni ürün ekleme moduna geç
  const handleAddProduct = () => {
    setCurrentProduct({
      ...defaultProduct,
      id: generateUniqueId(), // Benzersiz ID oluştur
    });
    setEditMode(true);
    setIsNewProduct(true);
    setImageError("");
  };
  
  // Silme modalını aç
  const openDeleteModal = (productId) => {
    setDeleteModal({ isOpen: true, productId });
  };

  // Silme modalını kapat
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null });
  };

  // Ürün silme işlemini gerçekleştir
  const handleDeleteProduct = () => {
    if (deleteModal.productId) {
      deleteProduct(deleteModal.productId);
      closeDeleteModal();
    }
  };
  
  // Input değişikliklerini takip et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Sayısal değerler için dönüşüm
    if (name === 'price') {
      const numValue = parseFloat(value);
      setCurrentProduct(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? value : numValue
      }));
    } else if (name === 'stock') {
      const numValue = parseInt(value);
      setCurrentProduct(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? value : numValue
      }));
    } else {
      setCurrentProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // URL için doğrulama
    if (name === "image") {
      if (!validateImageURL(value) && value.trim() !== "") {
        setImageError(
          "Ungültige Bild-URL. Die URL muss mit .jpg, .jpeg, .png oder .gif enden."
        );
      } else {
        setImageError("");
      }
    }
  };
  
  // Özellik değişikliklerini takip et
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...currentProduct.features];
    updatedFeatures[index] = value;
    setCurrentProduct(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };
  
  // Özellik ekle
  const addFeature = () => {
    setCurrentProduct(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };
  
  // Özellik sil
  const removeFeature = (index) => {
    const updatedFeatures = [...currentProduct.features];
    updatedFeatures.splice(index, 1);
    setCurrentProduct(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };
  
  // Formu kaydet
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // URL doğrulama
    if (!validateImageURL(currentProduct.image)) {
      setImageError(
        "Ungültige Bild-URL. Die URL muss mit .jpg, .jpeg, .png oder .gif enden."
      );
      return;
    }
    
    // Boş özellikleri temizle
    const cleanedFeatures = currentProduct.features.filter(feature => feature.trim() !== '');
    
    const updatedProduct = {
      ...currentProduct,
      features: cleanedFeatures
    };
    
    if (isNewProduct) {
      addProduct(updatedProduct);
    } else {
      updateProduct(currentProduct.id, updatedProduct);
    }
    
    setEditMode(false);
    setCurrentProduct(defaultProduct);
  };

  // Düzenleme formunu render et
  if (editMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-base-100 p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {isNewProduct ? 'Neues Produkt hinzufügen' : 'Produkt bearbeiten'}
            </h1>
            <button
              onClick={() => setEditMode(false)}
              className="text-base-content/70 hover:text-base-content cursor-pointer"
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
                  value={currentProduct.id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="z.B. product-1"
                  required
                  disabled={!isNewProduct} // ID bestehender Produkte kann nicht geändert werden
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-base-content font-medium mb-2">Produktname</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="z.B. Autoshampoo"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-base-content font-medium mb-2">Preis (€)</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="z.B. 11.99"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-base-content font-medium mb-2">Lagerbestand</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={currentProduct.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Bestandsmenge"
                  min="0"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-base-content font-medium mb-2">Produktbeschreibung</label>
                <textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="5"
                  placeholder="Produktbeschreibung"
                  maxLength="500"
                  required
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-base-content/60">Geben Sie eine detaillierte Beschreibung, um Kunden über das Produkt zu informieren.</p>
                  <p className="text-xs text-base-content/60">
                    {currentProduct.description ? currentProduct.description.length : 0}/500 Zeichen
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="image" className="block text-base-content font-medium mb-2">Produkt-Bild-URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={currentProduct.image}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${
                  imageError ? "border-error" : "border-base-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="https://beispiel.com/bild.jpg"
                required
              />
              {imageError && <p className="text-error text-sm mt-1">{imageError}</p>}
              <div className="mt-1">
                <p className="text-xs text-base-content/60">Kostenlose Stock-Foto-Webseiten: 
                  <a href="https://unsplash.com/search/photos/car-cleaning" target="_blank" rel="noopener noreferrer" className="text-primary ml-1 hover:underline">Unsplash</a>,
                  <a href="https://www.pexels.com/search/car%20cleaning/" target="_blank" rel="noopener noreferrer" className="text-primary ml-1 hover:underline">Pexels</a>
                </p>
                <p className="text-xs text-base-content/60 mt-1">Kopieren Sie die direkte URL des Bildes (z.B. https://images.unsplash.com/photo-xxxx)</p>
              </div>
            </div>
            
            {currentProduct.image && !imageError && (
              <div className="mb-6">
                <p className="text-base-content font-medium mb-2">Bildvorschau</p>
                <div className="h-48 rounded-lg overflow-hidden">
                  <img
                    src={currentProduct.image}
                    alt="Produktvorschau"
                    className="w-full h-full object-cover"
                    onError={() => setImageError("Fehler beim Laden des Bildes. Überprüfen Sie die URL.")}
                  />
                </div>
              </div>
            )}
            
            {/* Produktmerkmale */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base-content font-medium">Produktmerkmale</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center text-primary hover:text-primary-focus cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Merkmal hinzufügen
                </button>
              </div>
              
              <p className="text-xs text-base-content/60 mb-3">
                Fügen Sie Produktmerkmale als Aufzählungspunkte hinzu. Jedes Merkmal sollte kurz und präzise sein.
                Die Merkmale werden auf der Produktseite aufgelistet.
              </p>
              
              {currentProduct.features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="text-sm font-medium mr-2 text-base-content/70">{index + 1}.</span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`z.B. Hohe Qualität, Wasserdicht...`}
                    maxLength="100"
                  />
                  <div className="flex ml-2">
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-1 text-error hover:text-error-focus rounded-md hover:bg-error/10 cursor-pointer"
                      disabled={currentProduct.features.length <= 1} // Mindestens 1 Merkmal erforderlich
                      title="Merkmal löschen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {currentProduct.features.length < 10 && (
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-2 py-1 px-2 border border-dashed border-base-300 rounded-md text-base-content/60 hover:text-base-content hover:border-base-content/60 flex items-center justify-center w-full cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Neues Merkmal hinzufügen
                </button>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="py-2 px-4 border border-base-300 rounded-md text-base-content hover:bg-base-200 transition-colors cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-primary rounded-md text-primary-content hover:bg-primary-focus transition-colors cursor-pointer"
                disabled={!!imageError}
              >
                Speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Produktliste rendern
  return (
    <div className="bg-base-100 rounded-lg shadow-md overflow-hidden mb-8">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold">Produktverwaltung</h2>
        <button
          onClick={handleAddProduct}
          className="flex items-center py-2 px-4 bg-success rounded-md text-success-content hover:bg-success-focus transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neues Produkt hinzufügen
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {productData.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden bg-base-200 hover:shadow-md transition-shadow">
            <div className="h-40 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <span className="font-bold text-primary">{product.price} €</span>
              </div>
              <p className="text-base-content/70 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-end mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  {product.stock > 0 ? `Auf Lager: ${product.stock}` : 'Ausverkauft'}
                </span>
              </div>
              <div className="text-sm text-base-content/70 mb-3">
                <p className="font-medium">Merkmale:</p>
                <ul className="ml-4 mt-1 list-disc">
                  {(product.features || []).slice(0, 2).map((feature, idx) => (
                    <li key={idx} className="line-clamp-1">{feature}</li>
                  ))}
                  {product.features && product.features.length > 2 && (
                    <li className="text-base-content/50">+ {product.features.length - 2} weitere</li>
                  )}
                </ul>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="text-primary hover:text-primary-focus cursor-pointer"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => openDeleteModal(product.id)}
                  className="text-error hover:text-error-focus cursor-pointer"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Silme Onay Modalı */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        title="Produkt löschen"
        message="Sind Sie sicher, dass Sie dieses Produkt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmButtonText="Löschen"
        cancelButtonText="Abbrechen"
        icon="warning"
      />
    </div>
  );
};

export default AdminProductManager; 