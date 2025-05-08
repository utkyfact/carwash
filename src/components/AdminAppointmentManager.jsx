import React, { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';

const AdminAppointmentManager = () => {
  const { appointments, updateAppointmentStatus, APPOINTMENT_STATUS } = useAppointment();
  const [activeStatus, setActiveStatus] = useState(APPOINTMENT_STATUS.PENDING);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  
  // Duruma göre filtrelenmiş randevular
  const filteredAppointments = appointments.filter(appointment => appointment.status === activeStatus);
  
  // Randevu detayını göster
  const showAppointmentDetail = (appointment) => {
    setAppointmentDetail(appointment);
  };
  
  // Randevu detayını kapat
  const closeAppointmentDetail = () => {
    setAppointmentDetail(null);
  };
  
  // Randevu durumunu güncelle
  const handleUpdateStatus = (appointmentId, newStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
    
    // Eğer detay açıksa ve durumu değiştirilen randevu buysa, detayı kapat
    if (appointmentDetail && appointmentDetail.id === appointmentId) {
      setAppointmentDetail(null);
    }
  };
  
  // Duruma göre stil sınıfları
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case APPOINTMENT_STATUS.PENDING:
        return 'bg-warning text-warning-content';
      case APPOINTMENT_STATUS.CONFIRMED:
        return 'bg-info text-info-content';
      case APPOINTMENT_STATUS.COMPLETED:
        return 'bg-success text-success-content';
      case APPOINTMENT_STATUS.CANCELLED:
        return 'bg-error text-error-content';
      default:
        return 'bg-base-300 text-base-content';
    }
  };
  
  // Tarihi formatla
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-2xl font-bold">Terminverwaltung</h2>
      
      {/* Durum filtreleri */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {Object.values(APPOINTMENT_STATUS).map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
              activeStatus === status 
                ? 'bg-primary text-primary-content' 
                : 'bg-base-200 text-base-content hover:bg-base-300'
            }`}
          >
            {status === APPOINTMENT_STATUS.PENDING && 'Ausstehend'}
            {status === APPOINTMENT_STATUS.CONFIRMED && 'Bestätigt'}
            {status === APPOINTMENT_STATUS.COMPLETED && 'Abgeschlossen'}
            {status === APPOINTMENT_STATUS.CANCELLED && 'Storniert'}
          </button>
        ))}
      </div>
      
      {/* Terminliste */}
      <div className="overflow-x-auto">
        {filteredAppointments.length === 0 ? (
          <div className="py-8 text-center text-base-content/60">
            Keine Termine mit diesem Status vorhanden.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-base-200">
                <th className="px-4 py-3 text-left">Termin-Nr.</th>
                <th className="px-4 py-3 text-left">Datum & Uhrzeit</th>
                <th className="px-4 py-3 text-left">Kunde</th>
                <th className="px-4 py-3 text-left">Paket</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                <tr key={appointment.id} className="border-b border-base-200 hover:bg-base-100/50">
                  <td className="px-4 py-3">{appointment.id.split('-')[1]}</td>
                  <td className="px-4 py-3">
                    {formatDate(appointment.appointmentDate)} {appointment.appointmentTime}
                  </td>
                  <td className="px-4 py-3">{appointment.customerInfo.name}</td>
                  <td className="px-4 py-3">{appointment.package.name} - {appointment.package.price}€</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status === APPOINTMENT_STATUS.PENDING && 'Ausstehend'}
                      {appointment.status === APPOINTMENT_STATUS.CONFIRMED && 'Bestätigt'}
                      {appointment.status === APPOINTMENT_STATUS.COMPLETED && 'Abgeschlossen'}
                      {appointment.status === APPOINTMENT_STATUS.CANCELLED && 'Storniert'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => showAppointmentDetail(appointment)}
                        className="px-3 py-1 bg-base-300 hover:bg-base-400 rounded-md text-xs cursor-pointer"
                      >
                        Details
                      </button>
                      
                      {appointment.status === APPOINTMENT_STATUS.PENDING && (
                        <button 
                          onClick={() => handleUpdateStatus(appointment.id, APPOINTMENT_STATUS.CONFIRMED)}
                          className="px-3 py-1 bg-success hover:bg-success-focus text-success-content rounded-md text-xs cursor-pointer"
                        >
                          Bestätigen
                        </button>
                      )}
                      
                      {appointment.status === APPOINTMENT_STATUS.CONFIRMED && (
                        <button 
                          onClick={() => handleUpdateStatus(appointment.id, APPOINTMENT_STATUS.COMPLETED)}
                          className="px-3 py-1 bg-info hover:bg-info-focus text-info-content rounded-md text-xs cursor-pointer"
                        >
                          Abschließen
                        </button>
                      )}
                      
                      {appointment.status !== APPOINTMENT_STATUS.CANCELLED && appointment.status !== APPOINTMENT_STATUS.COMPLETED && (
                        <button 
                          onClick={() => handleUpdateStatus(appointment.id, APPOINTMENT_STATUS.CANCELLED)}
                          className="px-3 py-1 bg-error hover:bg-error-focus text-error-content rounded-md text-xs cursor-pointer"
                        >
                          Stornieren
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Termindetail-Modal */}
      {appointmentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAppointmentDetail}></div>
          <div className="bg-base-100 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Termindetails #{appointmentDetail.id.split('-')[1]}</h3>
              <button onClick={closeAppointmentDetail} className="text-base-content cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold mb-2">Kundeninformationen</h4>
                <p className="mb-1"><span className="font-medium">Name:</span> {appointmentDetail.customerInfo.name}</p>
                <p className="mb-1"><span className="font-medium">E-Mail:</span> {appointmentDetail.customerInfo.email}</p>
                <p className="mb-1"><span className="font-medium">Telefon:</span> {appointmentDetail.customerInfo.phone}</p>
                <p className="mb-1"><span className="font-medium">Fahrzeugmodell:</span> {appointmentDetail.customerInfo.carModel}</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Termininformationen</h4>
                <p className="mb-1">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointmentDetail.status)}`}>
                    {appointmentDetail.status === APPOINTMENT_STATUS.PENDING && 'Ausstehend'}
                    {appointmentDetail.status === APPOINTMENT_STATUS.CONFIRMED && 'Bestätigt'}
                    {appointmentDetail.status === APPOINTMENT_STATUS.COMPLETED && 'Abgeschlossen'}
                    {appointmentDetail.status === APPOINTMENT_STATUS.CANCELLED && 'Storniert'}
                  </span>
                </p>
                <p className="mb-1"><span className="font-medium">Termindatum:</span> {formatDate(appointmentDetail.appointmentDate)}</p>
                <p className="mb-1"><span className="font-medium">Terminzeit:</span> {appointmentDetail.appointmentTime}</p>
                <p className="mb-1"><span className="font-medium">Erstellt am:</span> {formatDate(appointmentDetail.createdAt)}</p>
                <p className="mb-1"><span className="font-medium">Zuletzt aktualisiert:</span> {formatDate(appointmentDetail.updatedAt)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold mb-2">Waschpaket</h4>
              <div className="bg-base-200 p-4 rounded-md">
                <p className="text-lg font-medium mb-1">{appointmentDetail.package.name}</p>
                <p className="text-xl font-bold">{appointmentDetail.package.price} €</p>
              </div>
            </div>
            
            <h4 className="font-bold mb-3">Statusverlauf</h4>
            <ul className="space-y-2 mb-6">
              {appointmentDetail.statusHistory.map((history, index) => (
                <li key={index} className="flex items-start">
                  <div className={`w-3 h-3 mt-1.5 rounded-full mr-3 ${getStatusBadgeClass(history.status)}`}></div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {history.status === APPOINTMENT_STATUS.PENDING && 'Ausstehend'}
                        {history.status === APPOINTMENT_STATUS.CONFIRMED && 'Bestätigt'}
                        {history.status === APPOINTMENT_STATUS.COMPLETED && 'Abgeschlossen'}
                        {history.status === APPOINTMENT_STATUS.CANCELLED && 'Storniert'}
                      </span>
                      <span className="text-sm text-base-content/60">{formatDate(history.date)}</span>
                    </div>
                    {history.note && <p className="text-sm">{history.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeAppointmentDetail}
                className="px-4 py-2 bg-base-300 text-base-content rounded-md hover:bg-base-400 transition-colors cursor-pointer"
              >
                Schließen
              </button>
              
              {appointmentDetail.status === APPOINTMENT_STATUS.PENDING && (
                <button
                  onClick={() => handleUpdateStatus(appointmentDetail.id, APPOINTMENT_STATUS.CONFIRMED)}
                  className="px-4 py-2 bg-success text-success-content rounded-md hover:bg-success-focus transition-colors cursor-pointer"
                >
                  Bestätigen
                </button>
              )}
              
              {appointmentDetail.status === APPOINTMENT_STATUS.CONFIRMED && (
                <button
                  onClick={() => handleUpdateStatus(appointmentDetail.id, APPOINTMENT_STATUS.COMPLETED)}
                  className="px-4 py-2 bg-info text-info-content rounded-md hover:bg-info-focus transition-colors cursor-pointer"
                >
                  Als abgeschlossen markieren
                </button>
              )}
              
              {appointmentDetail.status !== APPOINTMENT_STATUS.CANCELLED && appointmentDetail.status !== APPOINTMENT_STATUS.COMPLETED && (
                <button
                  onClick={() => handleUpdateStatus(appointmentDetail.id, APPOINTMENT_STATUS.CANCELLED)}
                  className="px-4 py-2 bg-error text-error-content rounded-md hover:bg-error-focus transition-colors cursor-pointer"
                >
                  Stornieren
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentManager; 