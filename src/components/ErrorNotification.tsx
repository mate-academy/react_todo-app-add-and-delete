/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Errors } from '../types/Errors';

interface Props {
  error: Errors | '';
  setError: (value: Errors | '') => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const errorMessage = useMemo(() => {
    switch (error) {
      case Errors.LoadError:
        return Errors.LoadError;
      case Errors.EmptyTitle:
        return Errors.EmptyTitle;
      case Errors.AddTodoError:
        return Errors.AddTodoError;
      case Errors.DeleteTodoError:
        return Errors.DeleteTodoError;
      case Errors.UpdateTodoError:
        return Errors.UpdateTodoError;
      default:
        return '';
    }
  }, [error]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === '' },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {errorMessage}
    </div>
  );
};
