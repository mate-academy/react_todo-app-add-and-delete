import React from 'react';
import classNames from 'classnames';
import { ErrorEnums } from '../enums/ErrorEnums';

type Props = {
  error: ErrorEnums;
  setError: (string: ErrorEnums) => void;
};

export const Error: React.FC<Props> = ({ error, setError }) => {

  if (error) {
    setTimeout(() => {
      setError(ErrorEnums.None);
    }, 2000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === ErrorEnums.None },
      )}
    >
      <button
        id="button"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorEnums.None)}
      >
        <label htmlFor="button">detete</label>
      </button>

      {error === ErrorEnums.Add && (
      'Unable to add a todo'
      )}

      {error === ErrorEnums.Delete && (
        'Unable to delete a todo'
      )}

      {error === ErrorEnums.Update && (
        'Unable to update a todo'
      )}
    </div>
  );
};
