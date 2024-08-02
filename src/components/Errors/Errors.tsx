import React, { useEffect } from 'react';
import { useTodos } from '../../utils/TodoContext';
import classNames from 'classnames';

export const Errors: React.FC = () => {
  const { error, clearCompletedError, setError, setClearCompletedError } =
    useTodos();

  const combinedError = error || clearCompletedError;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (combinedError) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setError(null);
        setClearCompletedError(null);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
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
