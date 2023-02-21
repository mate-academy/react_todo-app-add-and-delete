import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error,
  handleErrors: (value: Error) => void;
  removeError: () => void;
};

export const ErrorNotifications: React.FC<Props> = (
  {
    error,
    handleErrors,
    removeError,
  },
) => {
  const handleCloseButtonClick = () => {
    handleErrors(Error.NONE);
  };

  useEffect(() => {
    removeError();
  }, [error]);

  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      {
        hidden: error === Error.NONE,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Delete"
        onClick={() => handleCloseButtonClick()}
      />

      {/* show only one message at a time */}
      {error === Error.ONLOAD && (
        'Unable to load todos'
      )}

      {error === Error.EMPTY && (
        "Title can't be empty"
      )}

      {error === Error.ONADD && (
        'Unable to add a todo'
      )}

      {error === Error.ONDELETE && (
        'Unable to delete a todo'
      )}

      {error === Error.ONUPDATE && (
        'Unable to update a todo'
      )}
    </div>
  );
};
