import React, { Dispatch, SetStateAction, useEffect } from 'react';
import cn from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  errorMessage: ErrorType;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { errorMessage, setErrorMessage } = props;

  useEffect(() => {
    if (errorMessage === ErrorType.Default) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorType.Default);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: errorMessage === ErrorType.Default },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(ErrorType.Default)}
      />
      {`${errorMessage}`}
    </div>
  );
};
