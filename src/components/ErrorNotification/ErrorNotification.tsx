import cn from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timeOut = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timeOut);
      };
    }

    return undefined;
  }, [errorMessage, setErrorMessage]);

  const handleClose = () => {
    setErrorMessage('');
  };

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
        onClick={handleClose}
      />
      <p>{errorMessage}</p>
    </div>
  );
};
