import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';
import cn from 'classnames';

type Props = {
  error: ErrorTypes;
  setError: Dispatch<SetStateAction<ErrorTypes>>;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (error === ErrorTypes.Empty) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(ErrorTypes.Empty);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: error === ErrorTypes.Empty,
      })}
    >
      <button
        onClick={() => setError(ErrorTypes.Empty)}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {error !== ErrorTypes.Empty && error}
    </div>
  );
};
