import React, { useEffect } from 'react';
import classNames from 'classnames';
import { PossibleError } from '../../types/PossibleError';

type Props = {
  possibleError: PossibleError;
  isError: boolean;
  onErrorNotificationClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  possibleError,
  isError,
  onErrorNotificationClose,
}) => {
  let errorMessage = '';

  switch (possibleError) {
    case PossibleError.Add:
    case PossibleError.Delete:
    case PossibleError.Update:
    case PossibleError.Download:
      errorMessage = `Unable to ${possibleError} a todo`;

      break;

    case PossibleError.EmptyTitle:
      errorMessage = 'Title can`t be empty';

      break;

    default:
      errorMessage = '';
  }

  useEffect(() => {
    setTimeout(() => onErrorNotificationClose(), 3000);
  }, []);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isError,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onErrorNotificationClose}
        aria-label="Close error notification"
      />
      {errorMessage}
    </div>
  );
};
