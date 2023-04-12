import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage,
  closeError: () => void,
};

export const Errors: React.FC<Props> = ({ errorMessage, closeError }) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      closeError();
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !errorMessage },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeError}
      >
        ×
      </button>
      <div>{errorMessage}</div>
    </div>

  );
};
