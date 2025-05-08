import React, { useState, useEffect } from 'react';

// Demo envanter verileri
const initialInventory = [
  {
    id: 1,
    name: 'Autoshampoo Premium',
    category: 'Reinigungsmittel',
    supplier: 'CleanCar GmbH',
    unit: 'Liter',
    currentStock: 45,
    minStock: 20,
    price: 12.50,
    lastOrdered: '2023-11-10'
  },
  {
    id: 2,
    name: 'Felgenreiniger',
    category: 'Reinigungsmittel',
    supplier: 'CleanCar GmbH',
    unit: 'Liter',
    currentStock: 15,
    minStock: 15,
    price: 18.75,
    lastOrdered: '2023-10-28'
  },
  {
    id: 3,
    name: 'Wachspolitur',
    category: 'Pflegemittel',
    supplier: 'GlanzEffekt AG',
    unit: 'Liter',
    currentStock: 30,
    minStock: 10,
    price: 22.90,
    lastOrdered: '2023-11-05'
  },
  {
    id: 4,
    name: 'Mikrofasertücher',
    category: 'Zubehör',
    supplier: 'AutoPflege KG',
    unit: 'Stück',
    currentStock: 120,
    minStock: 50,
    price: 2.50,
    lastOrdered: '2023-10-15'
  },
  {
    id: 5,
    name: 'Insektenentferner',
    category: 'Reinigungsmittel',
    supplier: 'CleanCar GmbH',
    unit: 'Liter',
    currentStock: 8,
    minStock: 10,
    price: 15.20,
    lastOrdered: '2023-11-02'
  }
];

// Kategori seçenekleri
const categoryOptions = [
  'Reinigungsmittel', 'Pflegemittel', 'Zubehör', 'Geräte', 'Ersatzteile'
];

// Birim seçenekleri
const unitOptions = [
  'Liter', 'Stück', 'Karton', 'Packung', 'Kilogramm'
];

const AdminInventoryManager = () => {
  const [inventory, setInventory] = useState(() => {
    // LocalStorage'dan envanter verilerini yükle
    const savedInventory = localStorage.getItem('carwash_inventory');
    return savedInventory ? JSON.parse(savedInventory) : initialInventory;
  });

  const [currentItem, setCurrentItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Envanter verilerini LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('carwash_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Filtrelenmiş ve sıralanmış envanter
  const filteredInventory = inventory
    .filter(item =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === 'All' || item.category === filterCategory)
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Yeni ürün ekle
  const handleAddItem = () => {
    setCurrentItem({
      id: Date.now(),
      name: '',
      category: 'Reinigungsmittel',
      supplier: '',
      unit: 'Liter',
      currentStock: 0,
      minStock: 10,
      price: 0,
      lastOrdered: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setShowForm(true);
  };

  // Ürün düzenle
  const handleEditItem = (item) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
    setShowForm(true);
  };

  // Ürün sil
  const handleDeleteItem = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  // Stok ekle
  const handleAddStock = (id, amount) => {
    setInventory(inventory.map(item =>
      item.id === id
        ? { ...item, currentStock: item.currentStock + amount, lastOrdered: new Date().toISOString().split('T')[0] }
        : item
    ));
  };

  // Form gönderildiğinde
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Mevcut ürünü güncelle
      setInventory(inventory.map(item =>
        item.id === currentItem.id ? currentItem : item
      ));
    } else {
      // Yeni ürün ekle
      setInventory([...inventory, currentItem]);
    }

    // Formu kapat ve değerleri sıfırla
    setShowForm(false);
    setCurrentItem(null);
  };

  // Input değişikliklerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'currentStock' || name === 'minStock' || name === 'price'
        ? parseFloat(value)
        : value
    });
  };

  // Stok durumuna göre renk belirle
  const getStockLevelColor = (current, min) => {
    if (current <= 0) return 'text-error';
    if (current <= min) return 'text-warning';
    return 'text-success';
  };

  // Sıralama değiştir
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Tarih formatını düzenle
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Düşük stok uyarısı
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg md:text-2xl font-bold">Inventarverwaltung</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Artikel suchen..."
                className="input input-bordered w-full max-w-xs pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              className="select select-bordered"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">Alle Kategorien</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAddItem}
          >
            Neuer Artikel
          </button>
        </div>
      </div>

      {/* Uyarı alanı - Düşük stok */}
      {lowStockItems.length > 0 && (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold">Niedriger Lagerbestand!</h3>
            <div className="text-sm">
              {lowStockItems.length} Artikel haben einen niedrigen Lagerbestand und müssen nachbestellt werden.
            </div>
          </div>
        </div>
      )}

      {/* Envanter özeti kartları */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Gesamtartikel</div>
          <div className="stat-value">{inventory.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Niedrige Bestände</div>
          <div className="stat-value text-warning">{lowStockItems.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Bestandswert</div>
          <div className="stat-value">
            {inventory.reduce((sum, item) => sum + (item.price * item.currentStock), 0).toFixed(2)} €
          </div>
        </div>
      </div>

      {/* Envanter formu */}
      {showForm && (
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Artikel bearbeiten' : 'Neuer Artikel'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Artikelname</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentItem?.name || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kategorie</span>
                </label>
                <select
                  name="category"
                  value={currentItem?.category || ''}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Lieferant</span>
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={currentItem?.supplier || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Einheit</span>
                </label>
                <select
                  name="unit"
                  value={currentItem?.unit || ''}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {unitOptions.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Aktueller Bestand</span>
                </label>
                <input
                  type="number"
                  name="currentStock"
                  value={currentItem?.currentStock || 0}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mindestbestand</span>
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={currentItem?.minStock || 0}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Preis pro Einheit (€)</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={currentItem?.price || 0}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Zuletzt bestellt</span>
                </label>
                <input
                  type="date"
                  name="lastOrdered"
                  value={currentItem?.lastOrdered || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  required
                />
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

      {/* Envanter tablosu */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Artikelname
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th>Kategorie</th>
              <th
                className="cursor-pointer hidden lg:table-cell"
                onClick={() => handleSort('currentStock')}
              >
                <div className="flex items-center">
                  Bestand
                  {sortField === 'currentStock' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="hidden lg:table-cell">Einheit</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Preis
                  {sortField === 'price' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="hidden lg:table-cell">Letzte Bestellung</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td className={`${getStockLevelColor(item.currentStock, item.minStock)} hidden lg:table-cell`}>
                    {item.currentStock} {item.currentStock <= item.minStock && (
                      <span className="text-warning text-xs">(Min: {item.minStock})</span>
                    )}
                  </td>
                  <td className="hidden lg:table-cell">{item.unit}</td>
                  <td>{item.price.toFixed(2)} €</td>
                  <td className="hidden lg:table-cell">{formatDate(item.lastOrdered)}</td>
                  <td>
                    <div className="flex space-x-1">
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-square btn-sm btn-ghost">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box p-2">
                          <li><button onClick={() => handleAddStock(item.id, 1)}>+1 hinzufügen</button></li>
                          <li><button onClick={() => handleAddStock(item.id, 5)}>+5 hinzufügen</button></li>
                          <li><button onClick={() => handleAddStock(item.id, 10)}>+10 hinzufügen</button></li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="btn btn-square btn-sm btn-ghost"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
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
                <td colSpan="7" className="text-center py-4">
                  Keine Artikel gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventoryManager; 