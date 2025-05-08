import React, { useState } from "react";
import { useData } from "../context/DataContext";
import ConfirmationModal from "./ConfirmationModal";

const defaultSlide = {
  id: "",
  title: "",
  description: "",
  url: "",
};

const AdminSliderManager = () => {
  const { sliderData, addSlider, updateSlider, deleteSlider } = useData();
  const [currentSlide, setCurrentSlide] = useState(defaultSlide);
  const [editMode, setEditMode] = useState(false);
  const [isNewSlide, setIsNewSlide] = useState(false);
  const [imageError, setImageError] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sliderId: null });

  // Resim URL'sini doğrulama fonksiyonu
  const validateImageURL = (url) => {
    // Unsplash URL'leri veya normal resim uzantıları için doğrulama
    return url.includes('unsplash.com') || url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  // Slider düzenleme moduna geç
  const handleEditSlider = (slide) => {
    setCurrentSlide({ ...slide });
    setEditMode(true);
    setIsNewSlide(false);
    setImageError("");
  };

  // Yeni slider ekleme moduna geç
  const handleAddSlider = () => {
    setCurrentSlide({
      ...defaultSlide,
      id: `slider-${Date.now()}`,
    });
    setEditMode(true);
    setIsNewSlide(true);
    setImageError("");
  };

  // Silme modalını aç
  const openDeleteModal = (sliderId) => {
    setDeleteModal({ isOpen: true, sliderId });
  };

  // Silme modalını kapat
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, sliderId: null });
  };

  // Slider silme işlemini gerçekleştir
  const handleDeleteSlider = () => {
    if (deleteModal.sliderId) {
      deleteSlider(deleteModal.sliderId);
      closeDeleteModal();
    }
  };

  // Input değişikliklerini takip et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSlide((prev) => ({
      ...prev,
      [name]: value,
    }));

    // URL için doğrulama
    if (name === "url") {
      if (!validateImageURL(value) && value.trim() !== "") {
        setImageError(
          "Ungültige Bild-URL. Die URL muss mit .jpg, .jpeg, .png, .gif enden oder von Unsplash stammen."
        );
      } else {
        setImageError("");
      }
    }
  };

  // Formu kaydet
  const handleSubmit = (e) => {
    e.preventDefault();

    // URL doğrulama
    if (!validateImageURL(currentSlide.url)) {
      setImageError(
        "Ungültige Bild-URL. Die URL muss mit .jpg, .jpeg, .png, .gif enden oder von Unsplash stammen."
      );
      return;
    }

    if (isNewSlide) {
      addSlider(currentSlide);
    } else {
      updateSlider(currentSlide.id, currentSlide);
    }

    setEditMode(false);
    setCurrentSlide(defaultSlide);
  };

  // Düzenleme formunu render et
  if (editMode) {
    return (
      <div className="bg-base-100 p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isNewSlide ? "Neuen Slider hinzufügen" : "Slider bearbeiten"}
          </h2>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="text-base-content/70 hover:text-base-content cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-base-content font-medium mb-2">Titel</label>
            <input
              type="text"
              id="title"
              name="title"
              value={currentSlide.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-base-content font-medium mb-2">Beschreibung</label>
            <textarea
              id="description"
              name="description"
              value={currentSlide.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="url" className="block text-base-content font-medium mb-2">Bild-URL</label>
            <input
              type="text"
              id="url"
              name="url"
              value={currentSlide.url}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border ${
                imageError ? "border-error" : "border-base-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="https://beispiel.com/bild.jpg"
              required
            />
            {imageError && <p className="text-error text-sm mt-1">{imageError}</p>}
          </div>

          {currentSlide.url && !imageError && (
            <div className="mb-4">
              <p className="text-base-content font-medium mb-2">Vorschau</p>
              <div className="h-48 rounded-lg overflow-hidden">
                <img
                  src={currentSlide.url}
                  alt="Vorschau"
                  className="w-full h-full object-cover"
                  onError={() => setImageError("Fehler beim Laden des Bildes. Überprüfen Sie die URL.")}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border border-base-300 rounded-md text-base-content hover:bg-base-200 transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary rounded-md text-primary-content hover:bg-primary-focus transition-colors cursor-pointer"
              disabled={!!imageError}
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Slider listesini render et
  return (
    <div className="bg-base-100 rounded-lg overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-b gap-4">
        <h2 className="text-md md:text-xl font-semibold">Slider-Verwaltung</h2>
        <button
          onClick={handleAddSlider}
          className="flex items-center py-1 md:py-2 px-2 md:px-4 bg-success rounded-md text-success-content hover:bg-success-focus transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Neuen Slider hinzufügen
        </button>
      </div>

      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {sliderData.map((slide) => (
            <div
              key={slide.id}
              className="border rounded-lg overflow-hidden bg-base-200 hover:shadow-md transition-shadow"
            >
              <div className="h-40 overflow-hidden">
                <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{slide.title}</h3>
                <p className="text-base-content/70 text-sm mb-3 line-clamp-2">{slide.description}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEditSlider(slide)}
                    className="text-primary hover:text-primary-focus cursor-pointer"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => openDeleteModal(slide.id)}
                    className="text-error hover:text-error-focus cursor-pointer"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onay Modalı */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSlider}
        title="Slider löschen"
        message="Sind Sie sicher, dass Sie diesen Slider löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmButtonText="Löschen"
        cancelButtonText="Abbrechen"
        icon="warning"
      />
    </div>
  );
};

export default AdminSliderManager; 