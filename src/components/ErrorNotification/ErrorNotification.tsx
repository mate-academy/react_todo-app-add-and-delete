import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType;
  hasError: boolean;
  onNotificationClose: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({
    errorType,
    hasError,
    onNotificationClose,
  }) => {
    let errorMessage = '';

    switch (errorType) {
      case ErrorType.Add:
      case ErrorType.Delete:
      case ErrorType.Update:
      case ErrorType.Load:
        errorMessage = `Unable to ${errorType} a todo`;

        break;

      case ErrorType.EmptyTitle:
        errorMessage = 'Title can\'t be empty';

        break;

      default:
        errorMessage = '';
    }

    useEffect(() => {
      const timerId = setTimeout(() => onNotificationClose(), 3000);

      return () => clearTimeout(timerId);
    });

    return (
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !hasError,
          },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={onNotificationClose}
          aria-label="Close notification about an error"
        />

        {errorMessage}
      </div>
    );
  },
);
