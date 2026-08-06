// src/components/ErrorMessage.tsx
import React, { useEffect } from 'react';

interface Props {
  message: string;
  onClose: () => void;
}

export const ErrorMessage: React.FC<Props> = ({ message, onClose }) => {
  // Автоматически скрыть ошибку через 3 секунды
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className="error"
      data-cy="ErrorNotification" // <-- Изменили на ErrorNotification
    >
      <span>{message}</span>
      <button
        type="button"
        className="error__button"
        onClick={onClose}
        data-cy="ErrorButton"
      >
        ×
      </button>
    </div>
  );
};
