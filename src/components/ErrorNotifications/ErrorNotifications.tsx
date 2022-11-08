import React, { useEffect } from 'react';
import cn from 'classnames';

import { ErrorType } from '../../types/ErrorType';

interface Props {
  error: ErrorType;
  onCloseError: () => void;
}

export const ErrorNotifications: React.FC<Props> = ({
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
      className={cn(
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
      {error === ErrorType.UPLOAD && 'Unable to add a todo'}
      {error === ErrorType.DELETE && 'Unable to delete a todo'}
      {error === ErrorType.TITLE && 'Title can\'t be empty'}
    </div>
  );
};
