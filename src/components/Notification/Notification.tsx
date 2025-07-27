import cn from 'classnames';
import React, { useEffect } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';

interface Props {
  errorMessage: string;
  setErrorMessage: (value: ErrorMessages.None) => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.None)}
      />
      {errorMessage}
    </div>
  );
};
