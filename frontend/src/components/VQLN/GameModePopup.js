// components/VQLN/GameModePopup.js
import React from 'react';
import { Award, Video, Zap } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

const GameModePopup = ({ onClose }) => {
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={onClose}
      title="Game Mode Activated!"
      size="md"
      showCloseButton={false}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          marginBottom: '1rem', 
          padding: '1rem',
          background: 'linear-gradient(to right, #f97316, #facc15)',
          color: 'white',
          borderRadius: '9999px'
        }}>
          <Zap size={36} />
        </div>
        
        <p style={{ 
          marginBottom: '1.5rem', 
          color: '#4b5563', 
          fontSize: '1rem', 
          lineHeight: '1.5'
        }}>
          You've completed the tutorial. Now you'll earn rewards for answering correctly!
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          backgroundColor: '#fff7ed', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem' 
        }}>
          <div style={{ 
            padding: '0.5rem', 
            backgroundColor: '#ffedd5', 
            borderRadius: '9999px' 
          }}>
            <Video size={20} style={{ color: '#f97316' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: '600', color: '#1f2937' }}>Every 2 correct answers</p>
            <p style={{ color: '#4b5563' }}>Earn 1 video reward</p>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fefce8', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem' 
        }}>
          <div style={{ 
            padding: '0.5rem', 
            backgroundColor: '#fef9c3', 
            borderRadius: '9999px' 
          }}>
            <Award size={20} style={{ color: '#eab308' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: '600', color: '#1f2937' }}>Streak milestones (5, 10, 15...)</p>
            <p style={{ color: '#4b5563' }}>Earn bonus videos!</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={onClose}
          style={{
            background: 'linear-gradient(to right, #f97316, #facc15)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(249, 115, 22, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(249, 115, 22, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Let's Go!
        </button>
      </div>
    </StandardPopup>
  );
};

export default GameModePopup;
