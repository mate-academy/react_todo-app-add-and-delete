import React, { useEffect, useRef } from 'react';
import { ErrorType } from '../../types/ErrorType';

type ErrorsProps = {
  error: ErrorType | null;
  onErrorChange: (error: ErrorType | null) => void;
};

export const Errors: React.FC<ErrorsProps> = ({ error, onErrorChange }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onErrorChange(null);
        timerRef.current = null;
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [error, onErrorChange]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        !error ? 'hidden' : ''
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorChange(null)}
      />
      {error && <span>{error}</span>}
    </div>
  );
};
