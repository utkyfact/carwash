// Ürünler için başlangıç verileri
const initialProductData = [
  {
    id: 'product-1',
    name: 'Araç Yıkama Şampuanı',
    price: 9.99,
    description: 'Yüksek köpüklü, araç boyasına zarar vermeyen özel formül.',
    image: 'https://images.unsplash.com/photo-1618570364947-710d2c120d8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    stock: 25,
    category: 'Temizlik Ürünleri',
    features: [
      'Yüksek köpüklü formül',
      'Boya koruyucu teknoloji',
      'Doğa dostu içerik',
      'Profesyonel sonuçlar'
    ]
  },
  {
    id: 'product-2',
    name: 'Jant Temizleyici',
    price: 12.50,
    description: 'Zorlu jant kirlerini kolayca çözen profesyonel temizleyici.',
    image: 'https://plus.unsplash.com/premium_photo-1661693484578-6497e90fecd6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stock: 18,
    category: 'Temizlik Ürünleri',
    features: [
      'Güçlü asitsiz formül',
      'Tüm jant tiplerinde kullanılabilir',
      'Hızlı etki',
      'Fren tozu ve yol kirini kolayca çıkarır'
    ]
  },
  {
    id: 'product-3',
    name: 'Mikrofiber Bezler (5\'li Set)',
    price: 15.99,
    description: 'Araç temizliği için yüksek emici özellikli premium mikrofiber bezler.',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    stock: 30,
    category: 'Temizlik Aksesuarları',
    features: [
      'Ultra emici mikrofiber',
      'Yumuşak dokuma teknolojisi',
      'Çizik bırakmaz',
      'Yıkanabilir ve dayanıklı'
    ]
  },
  {
    id: 'product-4',
    name: 'Cila - Hızlı Parlatıcı',
    price: 18.99,
    description: 'Aracınıza anında parlaklık veren profesyonel cila.',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    stock: 15,
    category: 'Bakım Ürünleri',
    features: [
      'Silikon bazlı formül',
      'Suyun yüzeyden kaymasını sağlar',
      'UV koruma teknolojisi',
      'Uzun süreli parlaklık'
    ]
  }
];

export default initialProductData; 