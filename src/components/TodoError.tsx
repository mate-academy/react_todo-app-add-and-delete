import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';
type Props = {
  error: ErrorTypes;
  onError: (error: ErrorTypes) => void;
};

export const TodoError: React.FC<Props> = ({ error, onError }) => {
  useEffect(() => {
    if (error === ErrorTypes.Empty) {
      return;
    }

    const timer = setTimeout(() => {
      onError(ErrorTypes.Empty);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, onError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorTypes.Empty,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError(ErrorTypes.Empty)}
      />
      {error}
    </div>
  );
};
