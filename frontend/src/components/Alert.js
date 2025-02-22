// Alert.js
import React from 'react';

export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold flex items-center gap-2">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <div className="mt-2 text-gray-600">{children}</div>
);

export const DialogFooter = ({ children }) => (
  <div className="mt-6 flex justify-end gap-3">{children}</div>
);

export const Button = ({ onClick, variant = 'default', children }) => {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  const styles = {
    default: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${styles[variant]}`}
    >
      {children}
    </button>
  );
};