/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../enums/errorMessage';

type Props = {
  errorMessage: string;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
};

export const ErrorComponent: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage === ErrorMessage.None) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: errorMessage === ErrorMessage.None,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage(ErrorMessage.None);
        }}
      />
      {errorMessage}
    </div>
  );
};
