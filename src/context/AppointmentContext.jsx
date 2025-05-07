import React, { createContext, useState, useContext, useEffect } from 'react';
import { useData } from './DataContext';

// Context oluştur
const AppointmentContext = createContext();

// LocalStorage anahtar
const STORAGE_KEY = 'carwash_appointments';

// Randevu durumları
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',       // Onay bekliyor
  CONFIRMED: 'confirmed',   // Onaylandı
  COMPLETED: 'completed',   // Tamamlandı
  CANCELLED: 'cancelled'    // İptal edildi
};

// Context provider bileşeni
export const AppointmentProvider = ({ children }) => {
  const { washPackages } = useData();
  
  // State tanımları
  const [appointments, setAppointments] = useState(() => {
    // Eğer localStorage'da veri varsa onu kullan, yoksa boş dizi kullan
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("LocalStorage verisi ayrıştırılamadı:", error);
        return [];
      }
    }
    return [];
  });
  
  // Veri değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);
  
  // Yeni randevu oluşturma
  const createAppointment = (formData, packageId) => {
    const selectedPackage = washPackages.find(pkg => pkg.id === packageId) || null;
    
    const newAppointment = {
      id: `appt-${Date.now()}`, // Benzersiz ID oluştur
      package: {
        id: packageId,
        name: selectedPackage ? selectedPackage.name : 'Bilinmeyen Paket',
        price: selectedPackage ? selectedPackage.price : '0',
      },
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        carModel: formData.carModel
      },
      appointmentDate: formData.date,
      appointmentTime: formData.time,
      status: APPOINTMENT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: APPOINTMENT_STATUS.PENDING,
          date: new Date().toISOString(),
          note: 'Randevu oluşturuldu'
        }
      ]
    };
    
    setAppointments(prevAppointments => [newAppointment, ...prevAppointments]);
    return newAppointment.id;
  };
  
  // Randevu durumunu güncelleme
  const updateAppointmentStatus = (appointmentId, newStatus, note = '') => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment => {
        if (appointment.id === appointmentId) {
          const now = new Date().toISOString();
          return {
            ...appointment,
            status: newStatus,
            updatedAt: now,
            statusHistory: [
              ...appointment.statusHistory,
              {
                status: newStatus,
                date: now,
                note: note || `Randevu durumu ${newStatus} olarak güncellendi`
              }
            ]
          };
        }
        return appointment;
      })
    );
  };
  
  // Randevuyu silme/iptal etme
  const cancelAppointment = (appointmentId, note = 'Randevu iptal edildi') => {
    updateAppointmentStatus(appointmentId, APPOINTMENT_STATUS.CANCELLED, note);
  };
  
  // Tüm randevuları getir
  const getAllAppointments = () => {
    return appointments;
  };
  
  // Durum bazlı randevuları getir
  const getAppointmentsByStatus = (status) => {
    return appointments.filter(appointment => appointment.status === status);
  };
  
  // Tarih bazlı randevuları getir
  const getAppointmentsByDate = (date) => {
    return appointments.filter(appointment => appointment.appointmentDate === date);
  };
  
  // Provider değerleri
  const value = {
    appointments,
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getAllAppointments,
    getAppointmentsByStatus,
    getAppointmentsByDate,
    APPOINTMENT_STATUS
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Context hook
export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment hook, AppointmentProvider içinde kullanılmalıdır');
  }
  return context;
};

export default AppointmentContext; 