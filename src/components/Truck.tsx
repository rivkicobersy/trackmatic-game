import React from 'react';

interface TruckProps {
  position: number;
}

const Truck: React.FC<TruckProps> = ({ position }) => {
  return (
    <div 
      className="absolute bottom-8 transition-all duration-200"
      style={{ 
        left: `${position}%`,
        transform: `translateX(-50%)`,
        width: '128px',
        height: '80px'
      }}
    >
      <img 
        src="/truck.svg" 
        alt="Delivery Truck"
        className="w-full h-full object-contain"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
        }}
      />
    </div>
  );
};

export default Truck;