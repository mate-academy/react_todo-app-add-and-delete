import React, { useEffect } from 'react';
import classnames from 'classnames';

type Props = {
  error: boolean,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const ErrorNotification: React.FC<Props> = ({
  error, setError, message, setMessage,
}) => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setError(false);
      setMessage('');
    }, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  });

  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={classnames({
          notification: true,
          'is-danger': true,
          'is-light': true,
          'has-text-weight-normal': true,
          hidden: !error,
        })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="hide-error-button"
          onClick={() => setError(false)}
        />

        {message}
        <br />
      </div>
    </>
  );
};
