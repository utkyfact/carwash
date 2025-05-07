import React, { createContext, useState, useContext, useEffect } from 'react';
import initialWashPackages from '../data/washPackages';
import initialSliderData from '../data/sliderData';
import initialProductData from '../data/productData';
import initialAboutData from '../data/aboutData';

// Context oluştur
const DataContext = createContext();

// LocalStorage anahtar
const STORAGE_KEY = 'carwash_data';

// Context provider bileşeni
export const DataProvider = ({ children }) => {
  // State tanımları
  const [washPackages, setWashPackages] = useState(() => {
    // Eğer localStorage'da veri varsa onu kullan, yoksa başlangıç değerlerini kullan
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.washPackages) {
          return parsedData.washPackages;
        }
      } catch (error) {
        console.error("LocalStorage verisi ayrıştırılamadı:", error);
      }
    }
    return initialWashPackages;
  });
  
  // Slider verileri için state
  const [sliderData, setSliderData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.sliderData) {
          return parsedData.sliderData;
        }
      } catch (error) {
        console.error("LocalStorage verisi ayrıştırılamadı:", error);
      }
    }
    return initialSliderData;
  });

  // Ürün verileri için state
  const [productData, setProductData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.productData) {
          return parsedData.productData;
        }
      } catch (error) {
        console.error("LocalStorage verisi ayrıştırılamadı:", error);
      }
    }
    return initialProductData;
  });

  // Hakkımızda içeriği için state
  const [aboutContent, setAboutContent] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.aboutContent) {
          return parsedData.aboutContent;
        }
      } catch (error) {
        console.error("LocalStorage verisi ayrıştırılamadı:", error);
      }
    }
    return initialAboutData;
  });

  // Veri değiştiğinde localStorage'a kaydet
  useEffect(() => {
    const dataToSave = {
      washPackages,
      sliderData,
      productData,
      aboutContent
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [washPackages, sliderData, productData, aboutContent]);

  // Paket güncelleme fonksiyonu
  const updatePackage = (packageId, updatedData) => {
    setWashPackages(prevPackages => 
      prevPackages.map(pkg => 
        pkg.id === packageId ? { ...pkg, ...updatedData } : pkg
      )
    );
  };

  // Yeni paket ekleme fonksiyonu
  const addPackage = (newPackage) => {
    setWashPackages(prevPackages => [...prevPackages, newPackage]);
  };

  // Paket silme fonksiyonu
  const deletePackage = (packageId) => {
    setWashPackages(prevPackages => 
      prevPackages.filter(pkg => pkg.id !== packageId)
    );
  };
  
  // Slider güncelleeme fonksiyonu
  const updateSlider = (sliderId, updatedData) => {
    setSliderData(prevSliders => 
      prevSliders.map(slide => 
        slide.id === sliderId ? { ...slide, ...updatedData } : slide
      )
    );
  };
  
  // Yeni slider ekleme fonksiyonu
  const addSlider = (newSlider) => {
    setSliderData(prevSliders => [...prevSliders, newSlider]);
  };
  
  // Slider silme fonksiyonu
  const deleteSlider = (sliderId) => {
    setSliderData(prevSliders => 
      prevSliders.filter(slide => slide.id !== sliderId)
    );
  };

  // Ürün güncelleme fonksiyonu
  const updateProduct = (productId, updatedData) => {
    // features dizisinin varlığını kontrol et
    const safeUpdatedData = {
      ...updatedData,
      features: updatedData.features || []
    };
    
    setProductData(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, ...safeUpdatedData } : product
      )
    );
  };
  
  // Yeni ürün ekleme fonksiyonu
  const addProduct = (newProduct) => {
    // features dizisinin varlığını kontrol et
    const safeNewProduct = {
      ...newProduct,
      features: newProduct.features || []
    };
    
    setProductData(prevProducts => [...prevProducts, safeNewProduct]);
  };
  
  // Ürün silme fonksiyonu
  const deleteProduct = (productId) => {
    setProductData(prevProducts => 
      prevProducts.filter(product => product.id !== productId)
    );
  };

  // Hakkımızda içeriği güncelleme fonksiyonu
  const updateAboutContent = (updatedContent) => {
    setAboutContent(updatedContent);
  };
  
  // Veri resetleme fonksiyonu
  const resetData = () => {
    setWashPackages(initialWashPackages);
    setSliderData(initialSliderData);
    setProductData(initialProductData);
    setAboutContent(initialAboutData);
  };

  // Provider değerleri
  const value = {
    washPackages,
    updatePackage,
    addPackage,
    deletePackage,
    sliderData,
    updateSlider,
    addSlider,
    deleteSlider,
    productData,
    updateProduct,
    addProduct,
    deleteProduct,
    aboutContent,
    updateAboutContent,
    resetData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Context hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData hook, DataProvider içinde kullanılmalıdır');
  }
  return context;
};

export default DataContext; 