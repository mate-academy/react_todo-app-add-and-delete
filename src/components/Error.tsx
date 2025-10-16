import React, { useEffect } from 'react';

import { ErrorType } from '../types/ErrorType';

type Props = {
  error: ErrorType;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
};

export const Error: React.FC<Props> = ({ error, setError }) => {
  useEffect(() => {
    if (error === ErrorType.Empty) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(ErrorType.Empty);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.Empty)}
      />
      {error}
    </div>
  );
};
