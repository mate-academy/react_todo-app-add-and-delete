/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback } from 'react';
import cn from 'classnames';

type Props = {
  error: string,
  closeError: () => void;
};

export const Error: React.FC<Props> = React.memo(({
  error,
  closeError,
}) => {
  const errorMessage = useCallback((errMessage: string) => {
    switch (errMessage) {
      case 'load-todo':
        return 'Unable to load todos';
      case 'title-empty':
        return 'Title should not be empty';
      case 'add-todo':
        return 'Unable to add a todo';
      case 'delete-todo':
        return 'Unable to delete a todo';
      case 'update-todo':
        return 'Unable to update a todo';
      default: return errMessage;
    }
  }, [error]);

  return (
    // {/* Notification is shown in case of any error */}
    // {/* Add the 'hidden' class to hide the message smoothly */}
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeError}
      />
      {/* show only one message at a time */}
      {error && errorMessage(error)}
    </div>
  );
});
