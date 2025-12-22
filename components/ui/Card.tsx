import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${className} ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    >
      {children}
    </div>
  );
};