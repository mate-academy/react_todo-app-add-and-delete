import React, { useEffect } from 'react';
import classNames from 'classnames';

import { Error } from '../../types/Error';

interface Props {
  error: Error;
  onCloseError: () => void;
}

export const ErrorMessages: React.FC<Props> = ({
  error,
  onCloseError,
}) => {
  useEffect(() => {
    setTimeout(() => {
      onCloseError();
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error === Error.NONE },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="delete"
        type="button"
        className="delete"
        onClick={onCloseError}
      />

      {error === Error.LOAD && 'Unable to load todos'}
      {error === Error.UPLOAD && 'Unable to add a todo'}
      {error === Error.DELETE && 'Unable to delete a todo'}
      {error === Error.TITLE && 'Title can\'t be empty'}
    </div>
  );
};
