import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';

const AdminTodoManager = () => {
  // TodoList için state tanımları
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('carwash_todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos);
      } catch (error) {
        console.error("LocalStorage todo verisi ayrıştırılamadı:", error);
        return [];
      }
    }
    return [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, todoId: null });
  const [clearCompletedModal, setClearCompletedModal] = useState({ isOpen: false });
  
  // Verileri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('carwash_todos', JSON.stringify(todos));
  }, [todos]);
  
  // Yeni todo ekle
  const handleAddTodo = (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return;
    
    const todoItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, todoItem]);
    setNewTodo('');
  };
  
  // Todo tamamlandı/tamamlanmadı işaretleme
  const toggleTodoComplete = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Silme modalını aç
  const openDeleteModal = (todoId) => {
    setDeleteModal({ isOpen: true, todoId });
  };

  // Silme modalını kapat
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, todoId: null });
  };

  // Tamamlananları silme modalını aç
  const openClearCompletedModal = () => {
    setClearCompletedModal({ isOpen: true });
  };

  // Tamamlananları silme modalını kapat
  const closeClearCompletedModal = () => {
    setClearCompletedModal({ isOpen: false });
  };
  
  // Todo silme
  const handleDeleteTodo = () => {
    if (deleteModal.todoId) {
      setTodos(todos.filter(todo => todo.id !== deleteModal.todoId));
      
      // Düzenleme modunda silinen todo ise, düzenleme modunu kapat
      if (editingTodoId === deleteModal.todoId) {
        setEditingTodoId(null);
      }
      
      closeDeleteModal();
    }
  };
  
  // Todo düzenleme moduna geç
  const handleEditStart = (todo) => {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
  };
  
  // Todo düzenlemeyi tamamla
  const handleEditSave = (id) => {
    if (!editText.trim()) {
      openDeleteModal(id);
      return;
    }
    
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, text: editText.trim() } : todo
      )
    );
    
    setEditingTodoId(null);
    setEditText('');
  };
  
  // Todo düzenlemeyi iptal et
  const handleEditCancel = () => {
    setEditingTodoId(null);
    setEditText('');
  };
  
  // Tüm tamamlananları sil
  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    closeClearCompletedModal();
  };
  
  // Filtreleme
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // all
  });
  
  // İstatistikler
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length
  };
  
  // Tarih formatı
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-md md:text-lg font-bold">Notizen und Aufgaben</h2>
      
      {/* Todo Ekleme Formu */}
      <form onSubmit={handleAddTodo} className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Neue Notiz hinzufügen..."
          className="flex-grow px-4 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-focus transition-colors cursor-pointer"
        >
          Hinzufügen
        </button>
      </form>
      
      {/* Filtreler */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
            filter === 'all' 
              ? 'bg-primary text-primary-content' 
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          Alle ({stats.total})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
            filter === 'active' 
              ? 'bg-primary text-primary-content' 
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          Aktiv ({stats.active})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
            filter === 'completed' 
              ? 'bg-primary text-primary-content' 
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          Erledigt ({stats.completed})
        </button>
        {stats.completed > 0 && (
          <button
            onClick={openClearCompletedModal}
            className="px-3 py-1 ml-auto bg-error text-error-content rounded-md hover:bg-error-focus transition-colors cursor-pointer"
          >
            Erledigte löschen
          </button>
        )}
      </div>
      
      {/* Todolist */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-6 text-base-content/60">
            {filter === 'all' 
              ? 'Noch keine Notizen vorhanden' 
              : filter === 'active' 
                ? 'Keine aktiven Notizen vorhanden' 
                : 'Keine erledigten Notizen vorhanden'
            }
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div 
              key={todo.id} 
              className={`border border-base-200 rounded-lg p-4 ${
                todo.completed ? 'bg-base-200/50' : 'bg-base-100'
              }`}
            >
              {editingTodoId === todo.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(todo.id)}
                      className="px-3 py-1 bg-success text-success-content rounded-md hover:bg-success-focus transition-colors cursor-pointer"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 bg-base-300 text-base-content rounded-md hover:bg-base-400 transition-colors cursor-pointer"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoComplete(todo.id)}
                        className="checkbox checkbox-primary"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className={`${todo.completed ? 'line-through text-base-content/60' : ''}`}>
                        {todo.text}
                      </p>
                      <p className="text-xs text-base-content/50 mt-2">
                        {formatDate(todo.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditStart(todo)}
                        className="p-1 text-base-content/70 hover:text-primary transition-colors cursor-pointer"
                        title="Bearbeiten"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(todo.id)}
                        className="p-1 text-base-content/70 hover:text-error transition-colors cursor-pointer"
                        title="Löschen"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Todo Silme Onay Modalı */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTodo}
        title="Notiz löschen"
        message="Sind Sie sicher, dass Sie diese Notiz löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmButtonText="Löschen"
        cancelButtonText="Abbrechen"
        icon="warning"
      />

      {/* Tamamlananları Silme Onay Modalı */}
      <ConfirmationModal
        isOpen={clearCompletedModal.isOpen}
        onClose={closeClearCompletedModal}
        onConfirm={handleClearCompleted}
        title="Erledigte Notizen löschen"
        message="Sind Sie sicher, dass Sie alle erledigten Notizen löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmButtonText="Löschen"
        cancelButtonText="Abbrechen"
        icon="warning"
      />
    </div>
  );
};

export default AdminTodoManager; 