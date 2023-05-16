/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';

interface Props {
  onClose: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const Error: React.FC<Props> = ({ onClose, error, setError }) => {
  useEffect(() => {
    const hideNotification = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(hideNotification);
  }, [error]);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />

      {error}
    </div>
  );
};
