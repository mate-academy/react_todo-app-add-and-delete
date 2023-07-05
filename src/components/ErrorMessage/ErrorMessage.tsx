import React from 'react';
import classNames from 'classnames';
import { ErrorTypes } from '../../types/ErrorTypes';

interface ErrorMessageProps {
  isError: boolean,
  setIsError: (error: boolean) => void,
  errorMessage: ErrorTypes | undefined
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  isError,
  setIsError,
  errorMessage,
}) => {
  const handleDeleteError = () => {
    setIsError(false);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        type="button"
        aria-label="To delete an error"
        className="delete"
        onClick={handleDeleteError}
      />
      {errorMessage}
    </div>
  );
};
