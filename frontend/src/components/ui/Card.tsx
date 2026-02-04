import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-dark-900 rounded-xl shadow-xl shadow-black/30 border border-dark-800 overflow-hidden hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-dark-800 bg-dark-800/50">
          {title && <h3 className="text-lg font-semibold text-dark-50">{title}</h3>}
          {subtitle && <p className="text-sm text-dark-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
