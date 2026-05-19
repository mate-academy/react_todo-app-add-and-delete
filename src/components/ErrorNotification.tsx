import React from 'react';
import classNames from 'classnames';
import { ErrorType, errorMessages } from '../types/Errors';

type Props = {
  error: ErrorType | null;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === null,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(null);
        }}
      />

      {error && errorMessages[error]}
    </div>
  );
};
