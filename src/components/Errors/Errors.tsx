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

  const showError = () => {
    switch (error) {
      case Error.OnAdding:
        return 'Unable to add a todo';
      case Error.OnDeleting:
        return 'Unable to delete a todo';
      case Error.OnLoading:
        return 'Loading failed';
      case Error.OnTitle:
        return 'Title can\'t be empty';
      case Error.None:
      default:
        return '';
    }
  };

  const errorShown = showError();

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
      {errorShown}
    </div>
  );
};
