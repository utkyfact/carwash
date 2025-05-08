import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';

const AdminAboutManager = () => {
  const { aboutContent, updateAboutContent } = useData();
  
  // State tanımları
  const [editedContent, setEditedContent] = useState({...aboutContent});
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedStat, setExpandedStat] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Değişiklikleri kaydet
  const handleSave = () => {
    updateAboutContent(editedContent);
    toast.success('Über Uns Seite wurde erfolgreich aktualisiert!');
  };
  
  // Input değişikliklerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Contact bilgilerini güncelle
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setEditedContent(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };
  
  // Section içeriğini güncelle
  const handleSectionChange = (sectionId, field, value) => {
    setEditedContent(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value } 
          : section
      )
    }));
  };
  
  // Stat değerlerini güncelle
  const handleStatChange = (statId, field, value) => {
    setEditedContent(prev => ({
      ...prev,
      stats: prev.stats.map(stat => 
        stat.id === statId 
          ? { ...stat, [field]: value } 
          : stat
      )
    }));
  };
  
  // Section sıralama değişikliği
  const moveSectionUp = (index) => {
    if (index === 0) return;
    
    const newSections = [...editedContent.sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    
    setEditedContent(prev => ({
      ...prev,
      sections: newSections
    }));
  };
  
  const moveSectionDown = (index) => {
    if (index === editedContent.sections.length - 1) return;
    
    const newSections = [...editedContent.sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    
    setEditedContent(prev => ({
      ...prev,
      sections: newSections
    }));
  };
  
  // Stat sıralama değişikliği  
  const moveStatUp = (index) => {
    if (index === 0) return;
    
    const newStats = [...editedContent.stats];
    [newStats[index], newStats[index - 1]] = [newStats[index - 1], newStats[index]];
    
    setEditedContent(prev => ({
      ...prev,
      stats: newStats
    }));
  };
  
  const moveStatDown = (index) => {
    if (index === editedContent.stats.length - 1) return;
    
    const newStats = [...editedContent.stats];
    [newStats[index], newStats[index + 1]] = [newStats[index + 1], newStats[index]];
    
    setEditedContent(prev => ({
      ...prev,
      stats: newStats
    }));
  };
  
  // Önizleme için temel bileşenler
  const PreviewSection = ({ section, index }) => (
    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-4 mb-8 p-4 border rounded-lg`}>
      <div className="md:w-1/3">
        <img src={section.image} alt={section.title} className="w-full h-48 object-cover rounded-lg" />
      </div>
      <div className="md:w-2/3">
        <h3 className="text-xl font-bold text-primary">{section.title}</h3>
        <p className="mt-2 text-sm">{section.content}</p>
      </div>
    </div>
  );
  
  const PreviewStat = ({ stat }) => (
    <div className="border rounded-lg p-4 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
        <span className="text-xl text-primary">{stat.icon}</span>
      </div>
      <div className="text-2xl font-bold text-primary">{stat.value}</div>
      <div className="text-xs text-base-content/70">{stat.label}</div>
    </div>
  );
  
  // Hata durumunu kontrol et
  const validateForm = () => {
    if (!editedContent.heroImage || !editedContent.welcomeMessage || !editedContent.mainDescription) {
      return false;
    }
    
    const hasInvalidSection = editedContent.sections.some(
      section => !section.title || !section.content || !section.image
    );
    
    const hasInvalidStat = editedContent.stats.some(
      stat => !stat.label || !stat.value || !stat.icon
    );
    
    return !hasInvalidSection && !hasInvalidStat;
  };
  
  const isFormValid = validateForm();
  
  return (
    <div className="bg-base-100 rounded-lg overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-b gap-4">
        <h2 className="text-md md:text-xl font-semibold">Über Uns Seite Verwaltung</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="py-1 md:py-2 px-2 md:px-4 bg-info rounded-md text-info-content hover:bg-info-focus transition-colors cursor-pointer"
          >
            {previewMode ? 'Bearbeitungsmodus' : 'Vorschau'}
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`py-1 md:py-2 px-2 md:px-4 rounded-md text-primary-content cursor-pointer ${
              isFormValid 
                ? 'bg-primary hover:bg-primary-focus' 
                : 'bg-base-300 cursor-not-allowed'
            }`}
          >
            Änderungen speichern
          </button>
        </div>
      </div>
      
      {previewMode ? (
        // Önizleme modu
        <div className="p-6">
          <div className="bg-base-200 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Hero-Bereich</h3>
            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
              <img 
                src={editedContent.heroImage} 
                alt="Hero Image" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h1 className="text-xl font-bold text-white">{editedContent.welcomeMessage}</h1>
                <p className="text-white/90 text-sm">{editedContent.mainDescription}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Inhaltsbereiche</h3>
            {editedContent.sections.map((section, index) => (
              <PreviewSection key={section.id} section={section} index={index} />
            ))}
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Statistiken</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {editedContent.stats.map(stat => (
                <PreviewStat key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
          
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Kontaktinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <span className="text-xs font-medium text-base-content/70">Adresse</span>
                <p>{editedContent.contactInfo.address}</p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs font-medium text-base-content/70">Telefon</span>
                <p>{editedContent.contactInfo.phone}</p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs font-medium text-base-content/70">E-Mail</span>
                <p>{editedContent.contactInfo.email}</p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs font-medium text-base-content/70">Öffnungszeiten</span>
                <p>{editedContent.contactInfo.workingHours}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Düzenleme modu
        <div className="p-6">
          {/* Hero Bölümü */}
          <div className="mb-8 p-6 border rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Hero-Bereich</h3>
            
            <div className="mb-4">
              <label className="block text-base-content/70 text-sm font-medium mb-2">
                Hero-Bild URL
              </label>
              <input
                type="text"
                name="heroImage"
                value={editedContent.heroImage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-base-300 rounded-md"
                placeholder="https://example.com/image.jpg"
              />
              {editedContent.heroImage && (
                <div className="mt-2 h-40 rounded-lg overflow-hidden">
                  <img 
                    src={editedContent.heroImage}
                    alt="Hero önizleme"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-base-content/70 text-sm font-medium mb-2">
                Willkommensnachricht
              </label>
              <input
                type="text"
                name="welcomeMessage"
                value={editedContent.welcomeMessage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-base-300 rounded-md"
                placeholder="Willkommen bei Wolke Carwash"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-base-content/70 text-sm font-medium mb-2">
                Hauptbeschreibung
              </label>
              <textarea
                name="mainDescription"
                value={editedContent.mainDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-base-300 rounded-md"
                rows="4"
                placeholder="Schreiben Sie eine kurze Beschreibung über uns"
              />
            </div>
          </div>
          
          {/* İçerik Bölümleri */}
          <div className="mb-8 p-6 border rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Inhaltsbereiche</h3>
            
            {editedContent.sections.map((section, index) => (
              <div 
                key={section.id} 
                className="mb-6 p-4 border border-base-300 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">
                    {index + 1}. {section.title || 'Neuer Abschnitt'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded-md ${
                        index === 0 ? 'text-base-content/30' : 'text-base-content/70 hover:bg-base-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveSectionDown(index)}
                      disabled={index === editedContent.sections.length - 1}
                      className={`p-1 rounded-md ${
                        index === editedContent.sections.length - 1 ? 'text-base-content/30' : 'text-base-content/70 hover:bg-base-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="p-1 text-base-content/70 hover:bg-base-200 rounded-md"
                    >
                      {expandedSection === section.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedSection === section.id && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base-content/70 text-sm font-medium mb-2">
                        Titel
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-base-300 rounded-md"
                        placeholder="Abschnittstitel"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-base-content/70 text-sm font-medium mb-2">
                        Bild URL
                      </label>
                      <input
                        type="text"
                        value={section.image}
                        onChange={(e) => handleSectionChange(section.id, 'image', e.target.value)}
                        className="w-full px-4 py-2 border border-base-300 rounded-md"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-base-content/70 text-sm font-medium mb-2">
                        Inhalt
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                        className="w-full px-4 py-2 border border-base-300 rounded-md"
                        rows="5"
                        placeholder="Schreiben Sie den Inhalt des Abschnitts..."
                      />
                    </div>
                    
                    {section.image && (
                      <div className="md:col-span-2">
                        <div className="mt-2 h-40 rounded-lg overflow-hidden">
                          <img 
                            src={section.image}
                            alt={section.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/800x400?text=Bild+konnte+nicht+geladen+werden';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* İstatistikler */}
          <div className="mb-8 p-6 border rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Statistiken</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editedContent.stats.map((stat, index) => (
                <div 
                  key={stat.id} 
                  className="p-4 border border-base-300 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">
                      {stat.label || 'Neue Statistik'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveStatUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded-md ${
                          index === 0 ? 'text-base-content/30' : 'text-base-content/70 hover:bg-base-200'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveStatDown(index)}
                        disabled={index === editedContent.stats.length - 1}
                        className={`p-1 rounded-md ${
                          index === editedContent.stats.length - 1 ? 'text-base-content/30' : 'text-base-content/70 hover:bg-base-200'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setExpandedStat(expandedStat === stat.id ? null : stat.id)}
                        className="p-1 text-base-content/70 hover:bg-base-200 rounded-md"
                      >
                        {expandedStat === stat.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {expandedStat === stat.id && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-base-content/70 text-sm font-medium mb-2">
                          Beschriftung
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                          className="w-full px-4 py-2 border border-base-300 rounded-md"
                          placeholder="z.B.: Zufriedene Kunden"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-base-content/70 text-sm font-medium mb-2">
                          Wert
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                          className="w-full px-4 py-2 border border-base-300 rounded-md"
                          placeholder="z.B.: 5000+"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-base-content/70 text-sm font-medium mb-2">
                          Symbol
                        </label>
                        <select
                          value={stat.icon}
                          onChange={(e) => handleStatChange(stat.id, 'icon', e.target.value)}
                          className="w-full px-4 py-2 border border-base-300 rounded-md"
                        >
                          <option value="users">Benutzer</option>
                          <option value="car">Auto</option>
                          <option value="calendar">Kalender</option>
                          <option value="bottle">Flasche</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* İletişim Bilgileri */}
          <div className="mb-8 p-6 border rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Kontaktinformationen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base-content/70 text-sm font-medium mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={editedContent.contactInfo.address}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md"
                  placeholder="z.B.: Necatibey Straße Nr. 123, Çankaya, Ankara"
                />
              </div>
              
              <div>
                <label className="block text-base-content/70 text-sm font-medium mb-2">
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editedContent.contactInfo.phone}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md"
                  placeholder="z.B.: +90 (312) 456 78 90"
                />
              </div>
              
              <div>
                <label className="block text-base-content/70 text-sm font-medium mb-2">
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedContent.contactInfo.email}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md"
                  placeholder="z.B.: info@wolkecarwash.com"
                />
              </div>
              
              <div>
                <label className="block text-base-content/70 text-sm font-medium mb-2">
                  Öffnungszeiten
                </label>
                <input
                  type="text"
                  name="workingHours"
                  value={editedContent.contactInfo.workingHours}
                  onChange={handleContactChange}
                  className="w-full px-4 py-2 border border-base-300 rounded-md"
                  placeholder="z.B.: Werktags: 08:00 - 20:00, Wochenende: 09:00 - 18:00"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className={`py-2 px-4 rounded-md text-primary-content cursor-pointer ${
                isFormValid 
                  ? 'bg-primary hover:bg-primary-focus' 
                  : 'bg-base-300 cursor-not-allowed'
              }`}
            >
              Änderungen speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutManager; 