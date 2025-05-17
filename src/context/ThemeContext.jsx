import React, { createContext, useContext, useState, useEffect } from 'react';

// Tema context'i oluşturma
const ThemeContext = createContext();

// DaisyUI temaları
const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  // 'emerald',
  // 'corporate',
  // 'synthwave',
  'retro',
  'cyberpunk',
  // 'valentine',
  'halloween',
  'garden',
  // 'forest',
  // 'aqua',
  // 'lofi',
  // 'pastel',
  // 'fantasy',
  // 'wireframe',
  // 'black',
  // 'luxury',
  'dracula',
  // 'cmyk',
  'autumn',
  // 'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter'
];

// Hook'u dışa aktarma
export const useTheme = () => useContext(ThemeContext);

// Tema sağlayıcı bileşen
export const ThemeProvider = ({ children }) => {
  // Tarayıcıda saklanan tema tercihini veya varsayılan olarak 'light' kullanma
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('wolke-theme');
    return themes.includes(savedTheme) ? savedTheme : 'light';
  });
  
  // Tema değiştiğinde localStorage'e kaydetme ve HTML'e uygulama
  useEffect(() => {
    try {
      localStorage.setItem('wolke-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Tema değiştirme hatası:', error);
    }
  }, [theme]);
  
  // Temayı değiştirmek için fonksiyon
  const changeTheme = (newTheme) => {
    if (!newTheme || typeof newTheme !== 'string') {
      console.error('Geçersiz tema:', newTheme);
      return;
    }
    
    if (themes.includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.error('Bilinmeyen tema:', newTheme);
    }
  };
  
  // Tüm temaları döndür
  const getAllThemes = () => themes;
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme,
      getAllThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 