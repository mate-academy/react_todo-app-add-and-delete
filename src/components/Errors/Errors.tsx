/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Error } from '../../types/Error';

type Props = {
  hasError: boolean;
  onCloseError: () => void;
  error: Error,
};

export const Errors: React.FC<Props> = ({ hasError, onCloseError, error }) => {
  useEffect(() => {
    setTimeout(() => {
      onCloseError();
    }, 3000);
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseError}
      />
      {error === Error.OnAdding && 'Unable to add a todo'}
      {error === Error.OnTitle && 'Unable to add a todo'}
      {error === Error.OnDeleting && 'Unable to delete a todo'}
      {error === Error.OnLoading && 'Loading failed'}
    </div>
  );
};
