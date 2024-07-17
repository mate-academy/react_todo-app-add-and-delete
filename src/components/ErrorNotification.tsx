import classNames from 'classnames';
import React from 'react';
import { ErrorType } from '../types/ErrorType';

type ErrorNotificationProps = {
  error: ErrorType | null;
  returnError: () => string | null;
  onSetError: (error: ErrorType | null) => void;
};

export const ErrorNotification = ({
  error,
  returnError,
  onSetError,
}: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === null },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onSetError(null)}
      />
      {returnError()}
    </div>
  );
};
