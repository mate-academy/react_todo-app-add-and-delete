import React, { useEffect } from 'react';
import { Errors } from '../../types/ErrorTypes';

type Props = {
  errorMessage: Errors | null;
  setErrorMsg: (errorMsg: Errors | null) => void;
};

export const Error: React.FC<Props> = (
  {
    errorMessage,
    setErrorMsg,
  },
) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMsg(null);
    }, 3000);
  }, [setErrorMsg]);

  function handleErrorClick() {
    setErrorMsg(null);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage !== null ? '' : 'hidden'}`}

    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={handleErrorClick}
      />
      {errorMessage}
    </div>
  );
};
