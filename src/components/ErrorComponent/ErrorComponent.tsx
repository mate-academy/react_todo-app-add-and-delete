import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorStatusType';

type ErrorProps = {
  errorMessage: ErrorMessage | null;
  setErrorMessage: (errorMessage: ErrorMessage | null) => void;
};

export const ErrorComponent: React.FC<ErrorProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  });

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
