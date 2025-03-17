// components/VQLN/MilestoneCelebration.js
import React, { useEffect } from 'react';
import { Award, ChevronUp, Video } from 'lucide-react';

/**
 * Enhanced Milestone Celebration Component
 */
const MilestoneCelebration = ({ milestone, onClose }) => {
  useEffect(() => {
    // Try to create confetti effect if confetti.js is loaded
    const createConfetti = () => {
      if (typeof window !== 'undefined') {
        // If confetti.js is available, use it
        if (window.confetti) {
          window.confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF9F1C', '#FFB347', '#FFD700', '#FF6B6B', '#4CAF50']
          });
        } else {
          // Create simulated confetti with DOM elements if lib not available
          createDOMConfetti();
        }
      }
    };
    
    // Simulated confetti with DOM elements
    const createDOMConfetti = () => {
      const confettiCount = 100;
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.inset = '0';
      container.style.overflow = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
      
      const colors = ['#FF9F1C', '#FFB347', '#FFD700', '#FF6B6B', '#4CAF50'];
      
      // Create confetti pieces
      for (let i = 0; i < confettiCount; i++) {
        const piece = document.createElement('div');
        const size = Math.random() * 10 + 5;
        
        piece.style.position = 'absolute';
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.top = '60%';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.opacity = '1';
        piece.style.animation = `confetti-fall ${Math.random() * 3 + 2}s ease-out forwards`;
        
        container.appendChild(piece);
      }
      
      // Add animation style
      const style = document.createElement('style');
      style.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(${window.innerHeight}px) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(container);
        document.head.removeChild(style);
      }, 5000);
    };
    
    // Create confetti effect
    createConfetti();
    
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xs w-full mx-4 shadow-2xl animate-celebration">
        <div className="p-6 text-center">
          {/* Award icon */}
          <div className="mb-4 inline-flex justify-center">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full p-5">
              <Award size={48} />
            </div>
          </div>
          
          {/* Celebration text */}
          <h2 className="text-3xl font-bold mb-3 text-gradient">Streak Milestone!</h2>
          <p className="text-xl mb-5">
            You've answered <span className="font-bold text-orange-500">{milestone}</span> questions correctly in a row!
          </p>
          
          {/* Reward info */}
          <div className="flex items-center justify-center gap-3 mb-5 p-4 bg-orange-50 rounded-lg animate-pulse-slow">
            <Video size={28} className="text-orange-500" />
            <ChevronUp size={28} className="text-green-500" />
            <span className="text-xl font-bold">+1 Video Reward</span>
          </div>
          
          {/* Continue button */}
          <button 
            onClick={() => onClose && onClose()}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCelebration;
