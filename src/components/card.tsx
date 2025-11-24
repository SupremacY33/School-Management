import React, { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="card shadow-sm p-4" style={{ borderRadius: '12px' }}>
    {title && <h4 className="mb-3 text-center fw-bold">{title}</h4>}
    {children}
  </div>
);

export default Card;