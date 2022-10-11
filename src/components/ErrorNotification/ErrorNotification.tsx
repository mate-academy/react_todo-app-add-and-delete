import React from 'react';
import cN from 'classnames';
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
        className={cN(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorAlert },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorAlert(null)}
        >
          <></>
        </button>
        {errorAlert}
      </div>
    );
  },
);
