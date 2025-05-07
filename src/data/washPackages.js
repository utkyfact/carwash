// Yıkama paketleri - merkezi veri kaynağı
const initialWashPackages = [
  {
    id: 'standard',
    name: 'STANDARD',
    price: '11',
    features: ['Dış Yıkama', 'Köpüklü Temizlik', 'Jant Temizliği', 'Kurulama'],
    color: 'bg-blue-500',
  },
  {
    id: 'classic',
    name: 'CLASSIC',
    price: '14',
    features: ['Standard Paketi Dahil', 'İç Temizlik', 'Torpido Temizliği', 'Cam Temizliği'],
    color: 'bg-green-500',
  },
  {
    id: 'spezial',
    name: 'SPEZIAL',
    price: '15',
    features: ['Classic Paketi Dahil', 'Tavan Temizliği', 'Koltuk Temizliği', 'Ek Cilalama'],
    color: 'bg-yellow-500',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '18',
    features: ['Spezial Paketi Dahil', 'Detaylı İç Temizlik', 'Motor Temizliği', 'Özel Koruma Cilası'],
    color: 'bg-red-500',
  },
];

export default initialWashPackages; 