import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  useEffect(() => {
    if (errorMessage) {
      const timeOut = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timeOut);
      };
    } else {
      return;
    }
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
