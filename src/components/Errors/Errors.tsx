import React, { useEffect, useRef } from 'react';
import { useTodos } from '../../utils/TodoContext';
import { ErrorType } from '../../types/ErrorType';

type ErrorsProps = {
  error: ErrorType | null;
};

export const Errors: React.FC<ErrorsProps> = ({ error }) => {
  const { setError } = useTodos();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setError(null);
        timerRef.current = null;
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [error, setError]);

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
        onClick={() => setError(null)}
      />
      {error && <span>{error}</span>}
    </div>
  );
};
