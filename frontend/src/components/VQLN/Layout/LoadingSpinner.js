// LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default LoadingSpinner;