import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string,
  isError: boolean,
  setIsError: (value: boolean) => void,
};

export const ErrorMessages: React.FC<Props> = ({
  errorMessage,
  isError,
  setIsError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }, [isError, setIsError]);

  return (
    /* Notification is shown in case of any error */
    /* Add the 'hidden' class to hide the message smoothly */
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isError,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsError(false)}
      />
      {/* show only one message at a time */}
      {errorMessage}
      {/* <br />
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
