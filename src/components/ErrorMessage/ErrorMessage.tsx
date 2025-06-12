import React from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type ErrorMessageProps = {
  errorMessage: ErrorMessages;
  setErrorMessage: (value: React.SetStateAction<ErrorMessages>) => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorMessages.None)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
