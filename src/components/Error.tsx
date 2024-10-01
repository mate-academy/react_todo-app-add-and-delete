import React, { useEffect } from 'react';
// import cn from 'classnames';

interface ErrorProps {
  error: string | null;
  onClose: () => void;
}

export const Error: React.FC<ErrorProps> = ({ error, onClose }) => {
  useEffect(() => {
    if (error !== null) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [error, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error === null ? 'hidden' : ''}`}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" onClick={onClose} />
      {error}
    </div>
  );
};
