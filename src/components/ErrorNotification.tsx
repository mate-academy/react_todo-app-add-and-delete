import React, { useEffect } from 'react';
import { ErrorMessage } from '../types/Enum';

type Props = {
  errorMessage: ErrorMessage;
  setErrorMessage: (error: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage !== ErrorMessage.None) {
      const timerId = setTimeout(
        () => setErrorMessage(ErrorMessage.None),
        3000,
      );

      return () => clearTimeout(timerId);
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessage.None)}
      />
      {errorMessage}
    </div>
  );
};
