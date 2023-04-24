import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorMessage: ErrorType;
  onCloseError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseError,
}) => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      onCloseError();
    }, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

  return (
    <div
      className={classNames('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage })}
    >
      <button
        type="button"
        className="delete"
        onClick={onCloseError}
      >
        x
      </button>

      {errorMessage}
    </div>
  );
};
