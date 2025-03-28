import React from 'react';
import { ErrorType } from '../types/ErrorType';

type Props = {
  errorMessage: ErrorType;
  setError: (title: ErrorType) => void;
};

export const ErrorInfo: React.FC<Props> = ({ errorMessage, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        'notification is-danger is-light has-text-weight-normal' +
        (errorMessage === ErrorType.NoError ? ' hidden' : '')
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.NoError)}
      />
      {errorMessage}
    </div>
  );
};
