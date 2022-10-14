import React from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorAlert: ErrorType | null,
  setErrorAlert: (value: ErrorType | null) => void,
  setIsAdding: (value: boolean) => void,
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({
    errorAlert,
    setIsAdding,
    setErrorAlert,
  }) => {
    if (errorAlert) {
      setTimeout(() => {
        setErrorAlert(null);
        setIsAdding(false);
      }, 3000);
    }

    return (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          aria-label="Close Error Notification"
          type="button"
          className="delete"
          onClick={() => setErrorAlert(null)}
        />
        {errorAlert}
      </div>
    );
  },
);
