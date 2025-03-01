// components/VQLN/Common/StandardPopup.js
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Standard Popup Component - Styled like the Bombas popup example
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      }}
    >
      <div 
        className={`relative bg-white rounded-lg ${getWidth()} w-full mx-4 shadow-2xl overflow-hidden`}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          maxWidth: size === 'sm' ? '24rem' : size === 'lg' ? '32rem' : size === 'xl' ? '36rem' : '28rem',
          width: '100%',
          margin: '0 1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          transform: 'scale(1)',
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        {/* Optional header with title */}
        {(title || showCloseButton) && (
          <div 
            className="flex items-center justify-between border-b border-gray-200 px-6 py-4"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb',
              padding: '1rem 1.5rem'
            }}
          >
            {title && <h3 className="text-xl font-bold" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{title}</h3>}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                style={{ 
                  color: '#6b7280',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem'
                }}
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div 
          className="px-6 py-5"
          style={{ padding: '1.25rem 1.5rem' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Add scale-in animation to global styles
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(styleTag);

export default StandardPopup;
