import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props{
  errorMessage: ErrorMessages | null;
  setErrorMessage:(error: ErrorMessages | null) => void;
}

export const TodoNotification: React.FC<Props> = (
  {
    errorMessage,
    setErrorMessage,
  },
) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
        aria-label="Remove"
      />

      {errorMessage}

    </div>
  );
};
