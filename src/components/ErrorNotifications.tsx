import React, { useEffect, Dispatch } from 'react';
import cn from 'classnames';
import { Errors } from '../types/Errors';

type Props = {
  errorMessage: Errors;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
  handleResetErrorMessage: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
  handleResetErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(Errors.DEFAULT);
      }, 3000);
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
        onClick={handleResetErrorMessage}
      />

      {errorMessage}
    </div>
  );
};
