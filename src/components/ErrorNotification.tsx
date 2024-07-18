import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorType } from '../types/ErrorType';

type ErrorNotificationProps = {
  error: ErrorType | null;
  onSetError: (error: ErrorType | null) => void;
};

export const ErrorNotification = ({
  error,
  onSetError,
}: ErrorNotificationProps) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSetError(null);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const returnError = () => {
    switch (error) {
      case ErrorType.EmptyTitle:
        return 'Title should not be empty';
      case ErrorType.UnableToDelete:
        return 'Unable to delete a todo';
      case ErrorType.UnableToLoad:
        return 'Unable to load todos';
      case ErrorType.UnableToUpdate:
        return 'Unable to update a todo';
      case ErrorType.UnableToAdd:
        return 'Unable to add a todo';
      default:
        return null;
    }
  };

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
