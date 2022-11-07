/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../Enums/Enums';

type Props = {
  error: ErrorType,
  setError: (p: ErrorType) => void;
};

export const Errors: React.FC<Props> = (
  {
    error, setError,
  },
) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: error === ErrorType.None },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(ErrorType.None);
        }}
      />

      {error === ErrorType.Add && (
        'Unable to add a todo'
      )}
      <br />
      {error === ErrorType.Delete && (
        'Unable to delete a todo'
      )}
      <br />
      {error === ErrorType.Update && (
        'Unable to update a todo'
      )}
      {error === ErrorType.EmptyTitle && (
        'Title can\'t be empty'
      )}
    </div>
  );
};
