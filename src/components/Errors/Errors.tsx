import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Error } from '../../types/Error';

type Props = {
  error: Error,
  setErrorWrapper: (value: Error) => void;
  removeError: () => void;
};

export const Errors: React.FC<Props> = ({
  error,
  setErrorWrapper,
  removeError,
}) => {
  const handleCloseButtonClick = () => {
    setErrorWrapper(Error.NONE);
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
