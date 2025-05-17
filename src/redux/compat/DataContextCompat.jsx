import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
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
  resetData,
  selectWashPackages,
  selectSliderData,
  selectProductData,
  selectAboutContent
} from '../features/dataSlice';

// Backward compatibility context
const DataContext = createContext();

// CompatProvider - Redux ile DataContext arasında uyumluluk sağlayan bileşen
export const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Redux state'lerinden verileri al
  const washPackages = useSelector(selectWashPackages);
  const sliderData = useSelector(selectSliderData);
  const productData = useSelector(selectProductData);
  const aboutContent = useSelector(selectAboutContent);
  
  // Bu fonksiyonlar Redux actionları gönderecek
  const wrappedUpdatePackage = (packageId, updatedData) => {
    dispatch(updatePackage({ packageId, updatedData }));
  };
  
  const wrappedAddPackage = (newPackage) => {
    dispatch(addPackage(newPackage));
  };
  
  const wrappedDeletePackage = (packageId) => {
    dispatch(deletePackage(packageId));
  };
  
  const wrappedUpdateSlider = (sliderId, updatedData) => {
    dispatch(updateSlider({ sliderId, updatedData }));
  };
  
  const wrappedAddSlider = (newSlider) => {
    dispatch(addSlider(newSlider));
  };
  
  const wrappedDeleteSlider = (sliderId) => {
    dispatch(deleteSlider(sliderId));
  };
  
  const wrappedUpdateProduct = (productId, updatedData) => {
    dispatch(updateProduct({ productId, updatedData }));
  };
  
  const wrappedAddProduct = (newProduct) => {
    dispatch(addProduct(newProduct));
  };
  
  const wrappedDeleteProduct = (productId) => {
    dispatch(deleteProduct(productId));
  };
  
  const wrappedUpdateAboutContent = (updatedContent) => {
    dispatch(updateAboutContent(updatedContent));
  };
  
  const wrappedResetData = () => {
    dispatch(resetData());
  };
  
  // Context value
  const value = {
    washPackages,
    updatePackage: wrappedUpdatePackage,
    addPackage: wrappedAddPackage,
    deletePackage: wrappedDeletePackage,
    sliderData,
    updateSlider: wrappedUpdateSlider,
    addSlider: wrappedAddSlider,
    deleteSlider: wrappedDeleteSlider,
    productData,
    updateProduct: wrappedUpdateProduct,
    addProduct: wrappedAddProduct,
    deleteProduct: wrappedDeleteProduct,
    aboutContent,
    updateAboutContent: wrappedUpdateAboutContent,
    resetData: wrappedResetData
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData hook, DataProvider içinde kullanılmalıdır');
  }
  return context;
};

export default DataContext; 