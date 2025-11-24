import React from 'react';

interface AlertMessageProps {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => (
  <div className={`alert alert-${type}`} role="alert">
    {message}
  </div>
);

export default AlertMessage;