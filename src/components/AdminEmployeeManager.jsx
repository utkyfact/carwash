import React, { useState, useEffect } from 'react';

// Demo çalışan verileri
const initialEmployees = [
  { id: 1, name: 'Hans Müller', position: 'Waschanlagenführer', phone: '+49 123 45678', email: 'hans@wolke-carwash.de', shift: 'Frühschicht', status: 'Aktiv' },
  { id: 2, name: 'Maria Schmidt', position: 'Kassierer', phone: '+49 234 56789', email: 'maria@wolke-carwash.de', shift: 'Spätschicht', status: 'Aktiv' },
  { id: 3, name: 'Thomas Weber', position: 'Detailreiniger', phone: '+49 345 67890', email: 'thomas@wolke-carwash.de', shift: 'Wochenende', status: 'Aktiv' },
  { id: 4, name: 'Anna Meyer', position: 'Manager', phone: '+49 456 78901', email: 'anna@wolke-carwash.de', shift: 'Vollzeit', status: 'Im Urlaub' },
  { id: 5, name: 'Michael Wagner', position: 'Auszubildender', phone: '+49 567 89012', email: 'michael@wolke-carwash.de', shift: 'Teilzeit', status: 'Krank' }
];

// Position seçenekleri
const positionOptions = [
  'Waschanlagenführer', 'Kassierer', 'Detailreiniger', 'Manager', 'Auszubildender'
];

// Vardiya seçenekleri
const shiftOptions = [
  'Frühschicht', 'Spätschicht', 'Wochenende', 'Vollzeit', 'Teilzeit'
];

// Durum seçenekleri
const statusOptions = [
  'Aktiv', 'Im Urlaub', 'Krank', 'Beurlaubt'
];

const AdminEmployeeManager = () => {
  const [employees, setEmployees] = useState(() => {
    // LocalStorage'dan çalışan verilerini yükle
    const savedEmployees = localStorage.getItem('carwash_employees');
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployees;
  });
  
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Çalışan verilerini LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('carwash_employees', JSON.stringify(employees));
  }, [employees]);
  
  // Filtrelenmiş çalışanlar
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Yeni çalışan ekle
  const handleAddEmployee = () => {
    setCurrentEmployee({
      id: Date.now(),
      name: '',
      position: 'Waschanlagenführer',
      phone: '',
      email: '',
      shift: 'Vollzeit',
      status: 'Aktiv'
    });
    setIsEditing(false);
    setShowForm(true);
  };
  
  // Çalışan düzenle
  const handleEditEmployee = (employee) => {
    setCurrentEmployee({...employee});
    setIsEditing(true);
    setShowForm(true);
  };
  
  // Çalışan sil
  const handleDeleteEmployee = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Mitarbeiter löschen möchten?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };
  
  // Form gönderildiğinde
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Mevcut çalışanı güncelle
      setEmployees(employees.map(emp => 
        emp.id === currentEmployee.id ? currentEmployee : emp
      ));
    } else {
      // Yeni çalışan ekle
      setEmployees([...employees, currentEmployee]);
    }
    
    // Formu kapat ve değerleri sıfırla
    setShowForm(false);
    setCurrentEmployee(null);
  };
  
  // Input değişikliklerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee({
      ...currentEmployee,
      [name]: value
    });
  };
  
  // Personel durumuna göre renk belirle
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aktiv': return 'text-success';
      case 'Im Urlaub': return 'text-info';
      case 'Krank': return 'text-warning';
      case 'Beurlaubt': return 'text-error';
      default: return '';
    }
  };
  
  // Vardiya durumuna göre rozet belirle
  const getShiftBadge = (shift) => {
    switch (shift) {
      case 'Frühschicht': return 'badge-primary';
      case 'Spätschicht': return 'badge-secondary';
      case 'Wochenende': return 'badge-accent';
      case 'Vollzeit': return 'badge-success';
      case 'Teilzeit': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg md:text-2xl font-bold">Mitarbeiterverwaltung</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Mitarbeiter suchen..."
              className="input input-bordered w-full max-w-xs pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleAddEmployee}
          >
            Neuer Mitarbeiter
          </button>
        </div>
      </div>
      
      {/* Çalışan formu */}
      {showForm && (
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={currentEmployee?.name || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Position</span>
                </label>
                <select 
                  name="position"
                  value={currentEmployee?.position || ''}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {positionOptions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Telefon</span>
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={currentEmployee?.phone || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">E-Mail</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={currentEmployee?.email || ''}
                  onChange={handleInputChange}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Schicht</span>
                </label>
                <select 
                  name="shift"
                  value={currentEmployee?.shift || ''}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {shiftOptions.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select 
                  name="status"
                  value={currentEmployee?.status || ''}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Abbrechen
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                {isEditing ? 'Speichern' : 'Hinzufügen'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Çalışan listesi */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th className="hidden md:table-cell">Kontakt</th>
              <th className="hidden md:table-cell">Schicht</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span>{employee.phone}</span>
                      <span className="text-xs opacity-70">{employee.email}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className={`badge ${getShiftBadge(employee.shift)}`}>{employee.shift}</span>
                  </td>
                  <td>
                    <span className={getStatusColor(employee.status)}>{employee.status}</span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="btn btn-square btn-sm btn-ghost"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="btn btn-square btn-sm btn-ghost text-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Keine Mitarbeiter gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Vardiya açıklamaları */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="badge badge-primary">Frühschicht</span>
        <span className="badge badge-secondary">Spätschicht</span>
        <span className="badge badge-accent">Wochenende</span>
        <span className="badge badge-success">Vollzeit</span>
        <span className="badge badge-warning">Teilzeit</span>
      </div>
    </div>
  );
};

export default AdminEmployeeManager; 