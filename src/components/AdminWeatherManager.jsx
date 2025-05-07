import React, { useState, useEffect } from 'react';

// Demo hava durumu verileri
const demoWeatherData = {
  current: {
    temp: 8.4,
    humidity: 65,
    wind_speed: 12.3,
    weather: [{ id: 803, main: 'Clouds', description: 'überwiegend bewölkt', icon: '04d' }]
  },
  hourly: [
    { dt: Date.now() / 1000, temp: 8.4, weather: [{ id: 803, main: 'Clouds', description: 'überwiegend bewölkt', icon: '04d' }] },
    { dt: Date.now() / 1000 + 3600, temp: 9.1, weather: [{ id: 803, main: 'Clouds', description: 'überwiegend bewölkt', icon: '04d' }] },
    { dt: Date.now() / 1000 + 7200, temp: 10.2, weather: [{ id: 800, main: 'Clear', description: 'klar', icon: '01d' }] },
    { dt: Date.now() / 1000 + 10800, temp: 11.3, weather: [{ id: 800, main: 'Clear', description: 'klar', icon: '01d' }] },
    { dt: Date.now() / 1000 + 14400, temp: 11.8, weather: [{ id: 800, main: 'Clear', description: 'klar', icon: '01d' }] },
    { dt: Date.now() / 1000 + 18000, temp: 10.9, weather: [{ id: 801, main: 'Clouds', description: 'leicht bewölkt', icon: '02d' }] },
    { dt: Date.now() / 1000 + 21600, temp: 9.5, weather: [{ id: 801, main: 'Clouds', description: 'leicht bewölkt', icon: '02n' }] },
    { dt: Date.now() / 1000 + 25200, temp: 8.1, weather: [{ id: 802, main: 'Clouds', description: 'mäßig bewölkt', icon: '03n' }] },
  ],
  daily: [
    { 
      dt: Date.now() / 1000, 
      temp: { day: 9.5, min: 6.2, max: 11.8 }, 
      weather: [{ id: 803, main: 'Clouds', description: 'überwiegend bewölkt', icon: '04d' }],
      pop: 0.15
    },
    { 
      dt: Date.now() / 1000 + 86400, 
      temp: { day: 10.2, min: 5.8, max: 12.5 }, 
      weather: [{ id: 800, main: 'Clear', description: 'klar', icon: '01d' }],
      pop: 0.05
    },
    { 
      dt: Date.now() / 1000 + 172800, 
      temp: { day: 11.3, min: 7.1, max: 13.2 }, 
      weather: [{ id: 500, main: 'Rain', description: 'leichter Regen', icon: '10d' }],
      pop: 0.62
    },
    { 
      dt: Date.now() / 1000 + 259200, 
      temp: { day: 8.7, min: 5.4, max: 10.5 }, 
      weather: [{ id: 501, main: 'Rain', description: 'mäßiger Regen', icon: '10d' }],
      pop: 0.85
    },
    { 
      dt: Date.now() / 1000 + 345600, 
      temp: { day: 7.4, min: 4.2, max: 9.8 }, 
      weather: [{ id: 802, main: 'Clouds', description: 'mäßig bewölkt', icon: '03d' }],
      pop: 0.25
    },
    { 
      dt: Date.now() / 1000 + 432000, 
      temp: { day: 8.1, min: 5.7, max: 10.3 }, 
      weather: [{ id: 800, main: 'Clear', description: 'klar', icon: '01d' }],
      pop: 0.10
    },
    { 
      dt: Date.now() / 1000 + 518400, 
      temp: { day: 8.9, min: 6.3, max: 11.2 }, 
      weather: [{ id: 801, main: 'Clouds', description: 'leicht bewölkt', icon: '02d' }],
      pop: 0.15
    }
  ]
};

// Demo konum verileri
const initialLocations = [
  { id: 1, name: 'München', lat: 48.1351, lon: 11.5820, isActive: true },
  { id: 2, name: 'Berlin', lat: 52.5200, lon: 13.4050, isActive: false },
  { id: 3, name: 'Frankfurt', lat: 50.1109, lon: 8.6821, isActive: false },
];

const AdminWeatherManager = () => {
  const [locations, setLocations] = useState(() => {
    // LocalStorage'dan konum verilerini yükle
    const savedLocations = localStorage.getItem('carwash_locations');
    return savedLocations ? JSON.parse(savedLocations) : initialLocations;
  });
  
  const [weatherData, setWeatherData] = useState(demoWeatherData);
  const [currentLocationId, setCurrentLocationId] = useState(1);
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lon: '' });
  const [weatherUpdatedTime, setWeatherUpdatedTime] = useState(new Date());
  
  // Konum verilerini LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('carwash_locations', JSON.stringify(locations));
  }, [locations]);
  
  // Aktif konum değiştiğinde
  const handleChangeLocation = (id) => {
    // Normalde burada API'ye istek yapılır, ama demo için sadece durumu güncelliyoruz
    setCurrentLocationId(id);
    setWeatherUpdatedTime(new Date());
  };
  
  // Konum aktif/pasif yap
  const toggleLocationActive = (id) => {
    setLocations(locations.map(loc => 
      loc.id === id 
        ? {...loc, isActive: true} 
        : {...loc, isActive: false}
    ));
    setCurrentLocationId(id);
    setWeatherUpdatedTime(new Date());
  };
  
  // Konum ekle
  const handleAddLocation = (e) => {
    e.preventDefault();
    
    const location = {
      id: Date.now(),
      name: newLocation.name,
      lat: parseFloat(newLocation.lat),
      lon: parseFloat(newLocation.lon),
      isActive: false
    };
    
    setLocations([...locations, location]);
    setNewLocation({ name: '', lat: '', lon: '' });
    setShowAddLocationForm(false);
  };
  
  // Konum sil
  const handleDeleteLocation = (id) => {
    if (locations.length === 1) {
      alert('Sie müssen mindestens einen Standort haben!');
      return;
    }
    
    if (window.confirm('Sind Sie sicher, dass Sie diesen Standort löschen möchten?')) {
      const newLocations = locations.filter(loc => loc.id !== id);
      setLocations(newLocations);
      
      // Eğer aktif konum silindiyse, başka bir konumu aktif yap
      if (currentLocationId === id) {
        const newActiveLocation = newLocations[0];
        setCurrentLocationId(newActiveLocation.id);
        toggleLocationActive(newActiveLocation.id);
      }
    }
  };
  
  // Aktif konumu bul
  const activeLocation = locations.find(loc => loc.id === currentLocationId) || locations[0];
  
  // Tarih ve saat formatla
  const formatDateTime = (timestamp, type = 'full') => {
    const date = new Date(timestamp * 1000);
    
    if (type === 'time') {
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else if (type === 'day') {
      return date.toLocaleDateString('de-DE', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Hava durumuna göre ikon URL'si belirle
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };
  
  // Yağmur olasılığını yüzde olarak göster
  const getRainProbability = (pop) => {
    return Math.round(pop * 100);
  };
  
  // İş günü tavsiyesi oluştur
  const getBusinessAdvice = () => {
    // Yağmur varsa ya da yağmur olasılığı yüksekse
    const rainToday = weatherData.daily[0].weather[0].main === 'Rain' || weatherData.daily[0].pop > 0.5;
    const rainTomorrow = weatherData.daily[1].weather[0].main === 'Rain' || weatherData.daily[1].pop > 0.5;
    
    let advice;
    
    if (rainToday && rainTomorrow) {
      advice = {
        text: 'Heute und morgen sind aufgrund von Regen mehr Kunden zu erwarten. Extra Personal einplanen.',
        icon: '💧',
        color: 'text-info'
      };
    } else if (rainToday) {
      advice = {
        text: 'Heute sind aufgrund von Regen mehr Kunden zu erwarten. Nach Regenschauern besonders hoch.',
        icon: '💧',
        color: 'text-info'
      };
    } else if (rainTomorrow) {
      advice = {
        text: 'Morgen sind aufgrund von Regen mehr Kunden zu erwarten. Vorbereitungen treffen.',
        icon: '⚠️',
        color: 'text-warning'
      };
    } else {
      advice = {
        text: 'Gute Bedingungen für normale Waschfrequenz. Trocken und leicht bewölkt.',
        icon: '✅',
        color: 'text-success'
      };
    }
    
    return advice;
  };
  
  const businessAdvice = getBusinessAdvice();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Wettervorhersage</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline m-1">
              {activeLocation.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              {locations.map(loc => (
                <li key={loc.id}>
                  <button 
                    onClick={() => toggleLocationActive(loc.id)}
                    className={loc.isActive ? 'font-bold' : ''}
                  >
                    {loc.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => setShowAddLocationForm(true)} className="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Standort hinzufügen
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Konum ekleme formu */}
      {showAddLocationForm && (
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Neuen Standort hinzufügen</h3>
          
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Standort Name</span>
                </label>
                <input 
                  type="text" 
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  className="input input-bordered" 
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Breitengrad (Lat)</span>
                </label>
                <input 
                  type="text" 
                  value={newLocation.lat}
                  onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                  className="input input-bordered" 
                  required
                  placeholder="z.B. 48.1351"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Längengrad (Lon)</span>
                </label>
                <input 
                  type="text" 
                  value={newLocation.lon}
                  onChange={(e) => setNewLocation({...newLocation, lon: e.target.value})}
                  className="input input-bordered" 
                  required
                  placeholder="z.B. 11.5820"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAddLocationForm(false)}
              >
                Abbrechen
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Hinzufügen
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Aktif konum ve güncelleme bilgisi */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {activeLocation.name}
            <span className="text-sm font-normal opacity-70 ml-2">
              Lat: {activeLocation.lat.toFixed(4)}, Lon: {activeLocation.lon.toFixed(4)}
            </span>
          </h3>
        </div>
        <div className="text-sm opacity-70">
          Aktualisiert am: {weatherUpdatedTime.toLocaleDateString('de-DE')} {weatherUpdatedTime.toLocaleTimeString('de-DE')}
        </div>
      </div>
      
      {/* İş tavsiyesi */}
      <div className={`alert ${businessAdvice.color === 'text-success' ? 'alert-success' : businessAdvice.color === 'text-warning' ? 'alert-warning' : 'alert-info'}`}>
        <span className="text-xl mr-2">{businessAdvice.icon}</span>
        <span className="font-medium">{businessAdvice.text}</span>
      </div>
      
      {/* Güncel hava durumu */}
      <div className="bg-base-100 rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={getWeatherIconUrl(weatherData.current.weather[0].icon)} 
              alt={weatherData.current.weather[0].description}
              className="w-16 h-16"
            />
            <div>
              <div className="text-4xl font-bold">{weatherData.current.temp.toFixed(1)}°C</div>
              <div className="text-base-content/70">{weatherData.current.weather[0].description}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm opacity-70">Luftfeuchtigkeit</div>
              <div className="font-medium">{weatherData.current.humidity}%</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Wind</div>
              <div className="font-medium">{weatherData.current.wind_speed.toFixed(1)} km/h</div>
            </div>
            <div>
              <div className="text-sm opacity-70">Regenwahrscheinlichkeit</div>
              <div className="font-medium">{getRainProbability(weatherData.daily[0].pop)}%</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Saatlik tahmin */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Stündliche Vorhersage</h3>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {weatherData.hourly.slice(0, 8).map((hour, index) => (
            <div key={index} className="flex flex-col items-center bg-base-100 rounded-lg p-4 shadow-sm min-w-[100px]">
              <div className="text-sm font-medium">{formatDateTime(hour.dt, 'time')}</div>
              <img 
                src={getWeatherIconUrl(hour.weather[0].icon)} 
                alt={hour.weather[0].description}
                className="w-10 h-10 my-1"
              />
              <div className="font-bold">{hour.temp.toFixed(1)}°C</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 7 günlük tahmin */}
      <h3 className="text-lg font-semibold mt-8 mb-4">7-Tage-Vorhersage</h3>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Wetter</th>
              <th>Min/Max</th>
              <th>Regenwahrscheinlichkeit</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.daily.map((day, index) => (
              <tr key={index}>
                <td>{index === 0 ? 'Heute' : formatDateTime(day.dt, 'day')}</td>
                <td>
                  <div className="flex items-center">
                    <img 
                      src={getWeatherIconUrl(day.weather[0].icon)} 
                      alt={day.weather[0].description}
                      className="w-8 h-8 mr-2"
                    />
                    {day.weather[0].description}
                  </div>
                </td>
                <td>{day.temp.min.toFixed(1)}° / {day.temp.max.toFixed(1)}°</td>
                <td>
                  <div className="flex items-center">
                    <div className="relative w-24 h-3 bg-base-300 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full left-0 top-0 bg-info"
                        style={{ width: `${getRainProbability(day.pop)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{getRainProbability(day.pop)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Konum yönetimi */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Standortverwaltung</h3>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Koordinaten</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(location => (
              <tr key={location.id}>
                <td>{location.name}</td>
                <td>
                  <div>Lat: {location.lat.toFixed(4)}</div>
                  <div>Lon: {location.lon.toFixed(4)}</div>
                </td>
                <td>
                  <span className={`badge ${location.isActive ? 'badge-success' : 'badge-ghost'}`}>
                    {location.isActive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleLocationActive(location.id)}
                      className={`btn btn-square btn-sm ${location.isActive ? 'btn-success' : 'btn-ghost'}`}
                      disabled={location.isActive}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="btn btn-square btn-sm btn-ghost text-error"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Hava durumu açıklaması */}
      {/* <div className="alert alert-info mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p>In einer echten Umgebung würden die Wetterdaten über die OpenWeatherMap API abgerufen.</p>
          <p className="text-sm">API-Dokumentation: <a href="https://openweathermap.org/api" className="underline" target="_blank" rel="noreferrer">openweathermap.org/api</a></p>
        </div>
      </div> */}
    </div>
  );
};

export default AdminWeatherManager; 