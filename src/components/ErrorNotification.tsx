/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

interface Props {
  error: ErrorTypes | null;
  changeError: (value: ErrorTypes | null) => void;
}

const ErrorNotification:React.FC<Props> = (
  { error, changeError },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        error
          ? 'notification is-danger is-light has-text-weight-normal'
          : 'notification is-danger is-light has-text-weight-normal hidden'
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => changeError(null)}
      />

      {error}
    </div>
  );
};

export default ErrorNotification;
