import React, { useEffect } from 'react';

type Props = {
  changeError: (error: string) => void;
  errorMessage: string | null;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  changeError,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      changeError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, changeError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal 
        ${!errorMessage ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => changeError('')}
      />
      {errorMessage}
    </div>
  );
};
