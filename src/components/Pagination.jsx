import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Eğer tek sayfa varsa, pagination'ı gösterme
  if (totalPages <= 1) return null;

  // Gösterilecek sayfa numaralarını belirleme
  const getPageNumbers = () => {
    let pages = [];
    
    // Her zaman ilk sayfayı ekle
    pages.push(1);
    
    // Eğer şu anki sayfa 3'ten büyükse ve toplam sayfa sayısı 5'ten büyükse, bir önceki sayfayı ekle
    if (currentPage > 3 && totalPages > 5) {
      pages.push('...');
    }
    
    // Şu anki sayfanın bir öncesini ekle (eğer mevcut sayfa 2'den büyükse)
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }
    
    // Şu anki sayfayı ekle (eğer 1 veya son sayfa değilse)
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }
    
    // Şu anki sayfanın bir sonrasını ekle (eğer mevcut sayfa son sayfadan küçükse)
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }
    
    // Eğer şu anki sayfa son sayfadan 2 sayfa öncesinden daha küçükse, bir sonraki ... ekle
    if (currentPage < totalPages - 2 && totalPages > 5) {
      pages.push('...');
    }
    
    // Her zaman son sayfayı ekle (eğer toplam sayfa 1'den büyükse)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Tekrarlanan sayfa numaralarını kaldır
    return [...new Set(pages)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      {/* İlk sayfa butonu */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-base-200 text-base-content/50 cursor-not-allowed'
            : 'bg-base-200 text-base-content hover:bg-base-300 cursor-pointer'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Önceki sayfa butonu */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-base-200 text-base-content/50 cursor-not-allowed'
            : 'bg-base-200 text-base-content hover:bg-base-300 cursor-pointer'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Sayfa numaraları */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-primary text-primary-content cursor-default'
              : page === '...'
              ? 'bg-base-200 text-base-content cursor-default'
              : 'bg-base-200 text-base-content hover:bg-base-300 cursor-pointer'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Sonraki sayfa butonu */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-base-200 text-base-content/50 cursor-not-allowed'
            : 'bg-base-200 text-base-content hover:bg-base-300 cursor-pointer'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Son sayfa butonu */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-base-200 text-base-content/50 cursor-not-allowed'
            : 'bg-base-200 text-base-content hover:bg-base-300 cursor-pointer'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination; 