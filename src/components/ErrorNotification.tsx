import React, { useEffect } from 'react';
import { ErrorStatus } from '../types/ErrorStatus';

type Props = {
  error: string;
  setError: React.Dispatch<React.SetStateAction<ErrorStatus>>;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { error, setError } = props;

  useEffect(() => {
    if (error === ErrorStatus.Empty) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(ErrorStatus.Empty);
    }, 3000);

    return () => {
      clearInterval(timerId);
    };
  }, [error, setError]);

  // if (error !== ErrorStatus.Empty) return null;

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        error ? '' : 'hidden'
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorStatus.Empty)}
      />
      {error}
    </div>
  );
};
