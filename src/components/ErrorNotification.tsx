import { FC, useEffect } from 'react';
import cn from 'classnames';
import { useTodos } from '../utils/TodosContext';
import { Error } from '../types';

export const ErrorNotification: FC = () => {
  const { error, setError } = useTodos();

  useEffect(() => {
    const clearError = setTimeout(() => {
      setError(Error.NO_ERROR);
    }, 3000);

    return () => clearTimeout(clearError);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Error.NO_ERROR)}
      />
      {error}
    </div>
  );
};
