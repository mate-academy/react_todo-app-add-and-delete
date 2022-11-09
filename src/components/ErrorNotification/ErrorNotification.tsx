import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType;
  onCloseError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onCloseError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      onCloseError();
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error === ErrorType.NONE },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="delete"
        type="button"
        className="delete"
        onClick={onCloseError}
      />

      {error === ErrorType.LOAD && 'Unable to load todos'}
      {error === ErrorType.ADD && 'Unable to add a todo'}
      {error === ErrorType.TITLE && 'Title can\'t be empty'}
      {error === ErrorType.DELETE && 'Unable to delete a todo'}
    </div>
  );
};
