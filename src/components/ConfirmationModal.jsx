import React from "react";


const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Bestätigen",
  message = "Sind Sie sicher, dass Sie diese Aktion durchführen möchten?",
  confirmButtonText = "Löschen",
  cancelButtonText = "Abbrechen",
  icon = "warning"
}) => {
  if (!isOpen) return null;

  // İkon tipine göre uygun SVG'yi seç
  const getIconSvg = () => {
    switch (icon) {
      case "warning":
        return (
          <svg className="h-6 w-6 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "info":
        return (
          <svg className="h-6 w-6 text-info" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "success":
        return (
          <svg className="h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case "error":
        return (
          <svg className="h-6 w-6 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  // İkon arkaplan renk sınıflarını belirle
  const getIconBgClass = () => {
    switch (icon) {
      case "warning": return "bg-error/20";
      case "info": return "bg-info/20";
      case "success": return "bg-success/20";
      case "error": return "bg-error/20";
      default: return "bg-error/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Arkaplan overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-base-300 opacity-75"></div>
        </div>

        {/* Dikey hizalama için yardımcı */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        {/* Modal içeriği */}
        <div 
          className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-fade-in-down"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${getIconBgClass()} sm:mx-0 sm:h-10 sm:w-10`}>
                {getIconSvg()}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-base-content" id="modal-headline">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-base-content/70">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-error text-base font-medium text-error-content hover:bg-error-focus focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors cursor-pointer"
            >
              {confirmButtonText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-base-300 shadow-sm px-4 py-2 bg-base-100 text-base font-medium text-base-content hover:bg-base-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors cursor-pointer"
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 