import { createSlice } from '@reduxjs/toolkit';
import initialWashPackages from '../../data/washPackages';
import initialSliderData from '../../data/sliderData';
import initialProductData from '../../data/productData';
import initialAboutData from '../../data/aboutData';

// LocalStorage anahtar
const STORAGE_KEY = 'carwash_data';

// LocalStorage'dan veri yükleme
const loadDataFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("LocalStorage verisi ayrıştırılamadı:", error);
  }
  
  // Varsayılan değerleri döndür
  return {
    washPackages: initialWashPackages,
    sliderData: initialSliderData,
    productData: initialProductData,
    aboutContent: initialAboutData
  };
};

// Initial state yükle
const storedData = loadDataFromStorage();

const initialState = {
  washPackages: storedData.washPackages || initialWashPackages,
  sliderData: storedData.sliderData || initialSliderData,
  productData: storedData.productData || initialProductData,
  aboutContent: storedData.aboutContent || initialAboutData
};

// LocalStorage'a veri kaydetme yardımcı fonksiyonu
const saveDataToStorage = (state) => {
  const dataToSave = {
    washPackages: state.washPackages,
    sliderData: state.sliderData,
    productData: state.productData,
    aboutContent: state.aboutContent
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Paket işlemleri
    updatePackage: (state, action) => {
      const { packageId, updatedData } = action.payload;
      state.washPackages = state.washPackages.map(pkg => 
        pkg.id === packageId ? { ...pkg, ...updatedData } : pkg
      );
      saveDataToStorage(state);
    },
    
    addPackage: (state, action) => {
      state.washPackages.push(action.payload);
      saveDataToStorage(state);
    },
    
    deletePackage: (state, action) => {
      const packageId = action.payload;
      state.washPackages = state.washPackages.filter(pkg => pkg.id !== packageId);
      saveDataToStorage(state);
    },
    
    // Slider işlemleri
    updateSlider: (state, action) => {
      const { sliderId, updatedData } = action.payload;
      state.sliderData = state.sliderData.map(slide => 
        slide.id === sliderId ? { ...slide, ...updatedData } : slide
      );
      saveDataToStorage(state);
    },
    
    addSlider: (state, action) => {
      state.sliderData.push(action.payload);
      saveDataToStorage(state);
    },
    
    deleteSlider: (state, action) => {
      const sliderId = action.payload;
      state.sliderData = state.sliderData.filter(slide => slide.id !== sliderId);
      saveDataToStorage(state);
    },
    
    // Ürün işlemleri
    updateProduct: (state, action) => {
      const { productId, updatedData } = action.payload;
      // features dizisinin varlığını kontrol et
      const safeUpdatedData = {
        ...updatedData,
        features: updatedData.features || []
      };
      
      state.productData = state.productData.map(product => 
        product.id === productId ? { ...product, ...safeUpdatedData } : product
      );
      saveDataToStorage(state);
    },
    
    addProduct: (state, action) => {
      const newProduct = action.payload;
      // features dizisinin varlığını kontrol et
      const safeNewProduct = {
        ...newProduct,
        features: newProduct.features || []
      };
      
      state.productData.push(safeNewProduct);
      saveDataToStorage(state);
    },
    
    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.productData = state.productData.filter(product => product.id !== productId);
      saveDataToStorage(state);
    },
    
    // Hakkımızda içeriği işlemleri
    updateAboutContent: (state, action) => {
      state.aboutContent = action.payload;
      saveDataToStorage(state);
    },
    
    // Veri resetleme
    resetData: (state) => {
      state.washPackages = initialWashPackages;
      state.sliderData = initialSliderData;
      state.productData = initialProductData;
      state.aboutContent = initialAboutData;
      saveDataToStorage(state);
    }
  }
});

// Actions
export const { 
  updatePackage, 
  addPackage, 
  deletePackage, 
  updateSlider, 
  addSlider, 
  deleteSlider, 
  updateProduct, 
  addProduct, 
  deleteProduct, 
  updateAboutContent, 
  resetData 
} = dataSlice.actions;

// Selectors
export const selectWashPackages = (state) => state.data.washPackages;
export const selectSliderData = (state) => state.data.sliderData;
export const selectProductData = (state) => state.data.productData;
export const selectAboutContent = (state) => state.data.aboutContent;

export default dataSlice.reducer; 