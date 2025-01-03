import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ErrorType } from '../types/ErrorTypes';
import classNames from 'classnames';

type Props = {
  error: ErrorType;
  setError: Dispatch<SetStateAction<ErrorType>>;
};

export const ErrorNotification: React.FC<Props> = props => {
  const { error, setError } = props;

  useEffect(() => {
    if (error === ErrorType.Empty) {
      return;
    }

    const timerId = setTimeout(() => {
      setError(ErrorType.Empty);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === ErrorType.Empty },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(ErrorType.Empty)}
      />
      {error}
    </div>
  );
};
