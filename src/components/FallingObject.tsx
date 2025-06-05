import React from 'react';

interface FallingObjectProps {
  type: 'parcel' | 'pothole';
  position: {
    x: number;
    y: number;
  };
}

const FallingObject: React.FC<FallingObjectProps> = ({ type, position }) => {
  const { x, y } = position;
  
  return (
    <div 
      className={`absolute transition-transform`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {type === 'parcel' ? (
        <div className="animate-bounce-slow">
          <img 
            src="/box.svg" 
            alt="Parcel"
            className="w-12 h-12 object-contain"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
            }}
          />
        </div>
      ) : (
        <div className="animate-spin-slow">
          <img 
            src="/bomb.svg" 
            alt="Bomb"
            className="w-12 h-12 object-contain"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FallingObject