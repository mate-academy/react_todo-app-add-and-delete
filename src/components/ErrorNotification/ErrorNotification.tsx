import React from 'react';
import cn from 'classnames';

type ErrorNotificationProps = {
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        {/* show only one message at a time */}
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
    </>
  );
};
