import React, { useEffect, useRef } from 'react';
import { useTodos } from '../../utils/TodoContext';
import classNames from 'classnames';

export const Errors: React.FC = () => {
  const { error, clearCompletedError, setError, setClearCompletedError } =
    useTodos();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const combinedError = error || clearCompletedError;

  useEffect(() => {
    if (combinedError) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setError(null);
        setClearCompletedError(null);
        timerRef.current = null;
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [combinedError, setError, setClearCompletedError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !combinedError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(null);
          setClearCompletedError(null);
        }}
      />
      {combinedError && <span>{combinedError}</span>}
    </div>
  );
};
