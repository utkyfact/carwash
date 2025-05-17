import React, { useState, useEffect } from 'react';
import { useData } from '../redux/compat/DataContextCompat';

// Mock veri oluşturma fonksiyonları
const generateDailyData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' }),
      kundenAnzahl: Math.floor(Math.random() * 25) + 5,
      umsatz: Math.floor(Math.random() * 1500) + 500
    });
  }
  
  return data;
};

const generateMonthlyData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    
    data.push({
      monat: date.toLocaleDateString('de-DE', { month: 'short' }),
      kundenAnzahl: Math.floor(Math.random() * 500) + 200,
      umsatz: Math.floor(Math.random() * 25000) + 10000
    });
  }
  
  return data;
};

const generatePackageStats = (packages) => {
  return packages.map(pkg => ({
    paket: pkg.name,
    verkauf: Math.floor(Math.random() * 100) + 10,
    umsatz: Math.floor(Math.random() * 100) + 10 * parseFloat(pkg.price)
  }));
};

// Basit çubuk grafik bileşeni
const BarChart = ({ data, dataKey, labelKey, title, barColor = "#4338ca" }) => {
  const maxValue = Math.max(...data.map(item => item[dataKey])) * 1.2;
  
  return (
    <div className="bg-base-100 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm">{item[labelKey]}</div>
            <div className="flex-1">
              <div className="relative h-8 bg-base-200 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full left-0 top-0 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(item[dataKey] / maxValue) * 100}%`,
                    backgroundColor: barColor
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-end px-3 text-sm font-medium">
                  {dataKey === 'umsatz' ? `${item[dataKey].toLocaleString()} €` : item[dataKey]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Yüzde grafik (Doughnut alternatifi)
const PercentageChart = ({ data, valueKey, labelKey, title, colors }) => {
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  
  return (
    <div className="bg-base-100 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-3">
        {data.map((item, index) => {
          const percentage = ((item[valueKey] / total) * 100).toFixed(1);
          
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div className="flex-1 text-sm">{item[labelKey]}</div>
              <div className="text-sm font-medium">{percentage}%</div>
              <div className="w-20 text-right text-sm">
                {valueKey === 'umsatz' ? `${item[valueKey].toLocaleString()} €` : item[valueKey]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// İstatistik kartı bileşeni
const StatCard = ({ title, value, icon, change, color = "bg-primary" }) => {
  return (
    <div className="bg-base-100 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base-content/70 text-sm">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className={`mt-2 text-xs ${change >= 0 ? 'text-success' : 'text-error'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% im Vergleich zur Vorwoche
          </div>
        </div>
        <div className={`${color} text-primary-content p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { washPackages } = useData();
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [packageStats, setPackageStats] = useState([]);
  const [timeFilter, setTimeFilter] = useState('week'); // 'week' veya 'month'
  
  // Veri oluşturma
  useEffect(() => {
    setDailyData(generateDailyData());
    setMonthlyData(generateMonthlyData());
    setPackageStats(generatePackageStats(washPackages));
  }, [washPackages]);

  // Toplam istatistikler
  const currentData = timeFilter === 'week' ? dailyData : monthlyData;
  const totalRevenue = currentData.reduce((sum, item) => sum + item.umsatz, 0);
  const totalCustomers = currentData.reduce((sum, item) => sum + item.kundenAnzahl, 0);
  const avgTicket = totalRevenue / totalCustomers;
  
  // Renk paleti
  const chartColors = [
    "#4338ca", "#3b82f6", "#10b981", "#f59e0b", 
    "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg md:text-2xl font-bold">Dashboard</h2>
        <div className="join">
          <button 
            className={`join-item btn ${timeFilter === 'week' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTimeFilter('week')}
          >
            Wöchentlich
          </button>
          <button 
            className={`join-item btn ${timeFilter === 'month' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTimeFilter('month')}
          >
            Monatlich
          </button>
        </div>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Gesamtumsatz" 
          value={`${totalRevenue.toLocaleString()} €`} 
          change={12.5} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          } 
          color="bg-primary"
        />
        <StatCard 
          title="Kundenanzahl" 
          value={totalCustomers} 
          change={8.1} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          } 
          color="bg-secondary"
        />
        <StatCard 
          title="Durchschnittlicher Umsatz" 
          value={`${avgTicket.toLocaleString()} €`} 
          change={-2.3} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="bg-accent" 
        />
        <StatCard 
          title="Auslastung" 
          value="76%" 
          change={5.2} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="bg-info" 
        />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={timeFilter === 'week' ? dailyData : monthlyData}
          dataKey="kundenAnzahl"
          labelKey={timeFilter === 'week' ? 'date' : 'monat'}
          title={`${timeFilter === 'week' ? 'Wöchentliche' : 'Monatliche'} Kundenanzahl`}
          barColor="#3b82f6"
        />
        <BarChart 
          data={timeFilter === 'week' ? dailyData : monthlyData}
          dataKey="umsatz"
          labelKey={timeFilter === 'week' ? 'date' : 'monat'}
          title={`${timeFilter === 'week' ? 'Wöchentlicher' : 'Monatlicher'} Umsatz`}
          barColor="#10b981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PercentageChart 
          data={packageStats}
          valueKey="verkauf"
          labelKey="paket"
          title="Paketverkauf Verteilung"
          colors={chartColors}
        />
        <PercentageChart 
          data={packageStats}
          valueKey="umsatz"
          labelKey="paket"
          title="Paketumsatz Verteilung"
          colors={chartColors}
        />
      </div>

      {/* En popüler saatler/günler tablosu */}
      <div className="bg-base-100 rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Stoßzeiten</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Zeitraum</th>
                <th>Kundenanzahl</th>
                <th>Auslastung</th>
                <th>Durchschnittliche Wartezeit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:00 - 11:00</td>
                <td>42</td>
                <td>65%</td>
                <td>12 Min</td>
              </tr>
              <tr>
                <td>11:00 - 13:00</td>
                <td>68</td>
                <td>92%</td>
                <td>24 Min</td>
              </tr>
              <tr>
                <td>13:00 - 15:00</td>
                <td>53</td>
                <td>78%</td>
                <td>18 Min</td>
              </tr>
              <tr>
                <td>15:00 - 17:00</td>
                <td>76</td>
                <td>98%</td>
                <td>32 Min</td>
              </tr>
              <tr>
                <td>17:00 - 19:00</td>
                <td>65</td>
                <td>85%</td>
                <td>22 Min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 