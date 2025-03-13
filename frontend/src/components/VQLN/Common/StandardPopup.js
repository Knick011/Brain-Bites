import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable popup component
 */
const StandardPopup = ({ 
  children, 
  isOpen, 
  onClose, 
  title, 
  showCloseButton = true,
  size = 'md',
  preventBackgroundClick = false
}) => {
  // Close on ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Handle background click
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget && !preventBackgroundClick) {
      onClose();
    }
  };
  
  // Determine width based on size
  const getWidth = () => {
    switch(size) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case 'md':
      default: return 'max-w-md';
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity"
      onClick={handleBackgroundClick}
    >
      <div 
        className={`bg-white rounded-lg ${getWidth()} w-full mx-4 shadow-2xl overflow-hidden animate-scaleIn`}
      >
        {/* Optional header with title */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            {title && <h3 className="text-xl font-bold">{title}</h3>}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandardPopup;
