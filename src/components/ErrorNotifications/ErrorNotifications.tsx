import classNames from 'classnames';
import React from 'react';

interface ErrorNotificationsProps {
  error: boolean;
  errorMessage: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const ErrorNotifications: React.FC<ErrorNotificationsProps> = ({
  error,
  errorMessage,
  setError,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError(false);
          setErrorMessage('');
        }}
      />
      {/* show only one message at a time */}
      {errorMessage}
      {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};
