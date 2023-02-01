/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  closeError: (message: string) => void,
  errorMessages: string[];
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  closeError,
  errorMessages,
}) => {
  return (
    <>
      {errorMessages.map(message => (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => closeError(message)}
          />

          {message}
          <br />
        </div>
      ))}
    </>
  );
});
