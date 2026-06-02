import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const CartNotification = () => {
  const { notification } = useNotification();
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      setCurrentNotification(notification);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!currentNotification || !visible) return null;

  const isSuccess = currentNotification.type === 'success';
  const isError = currentNotification.type === 'error';
  const isInfo = currentNotification.type === 'info';

  const getBackgroundColor = () => {
    if (isSuccess) return '#10B981';
    if (isError) return '#EF4444';
    return '#3B82F6';
  };

  const getIcon = () => {
    if (isSuccess) return <FaCheckCircle size={20} />;
    if (isError) return <FaExclamationCircle size={20} />;
    return <FaInfoCircle size={20} />;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: getBackgroundColor(),
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {getIcon()}
      <span style={{ fontSize: '14px', fontWeight: '500' }}>
        {currentNotification.message}
      </span>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CartNotification;
