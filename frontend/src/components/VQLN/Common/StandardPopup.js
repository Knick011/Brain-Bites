// components/VQLN/Common/StandardPopup.js
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Standard Popup Component
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Content inside the popup
 * @param {boolean} props.isOpen - Whether the popup is visible
 * @param {function} props.onClose - Function to call when closing the popup
 * @param {string} props.title - Title of the popup (optional)
 * @param {boolean} props.showCloseButton - Whether to show the close button (default: true)
 * @param {string} props.size - Size of the popup ('sm', 'md', 'lg') (default: 'md')
 * @param {boolean} props.preventBackgroundClick - Prevent closing when clicking background (default: false)
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
      onClick={handleBackgroundClick}
    >
      <div className={`relative bg-white rounded-xl ${getWidth()} w-full mx-4 shadow-2xl animate-scaleIn`}>
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
