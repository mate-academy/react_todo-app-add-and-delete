import React from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  errorMessage: Error,
  onCloseError: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseError,
}) => {
  return (
    <div
      className={classNames(
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
        onClick={onCloseError}
      >
        ×
      </button>

      {errorMessage}
    </div>
  );
};
