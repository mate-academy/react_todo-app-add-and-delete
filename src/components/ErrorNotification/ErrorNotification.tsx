/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Errors } from '../../types/Errors';

interface Props {
  errorMessage: Errors | null;
  hideError: () => void;
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorMessage,
  hideError,
}) => {
  useEffect(() => {
    const timerId = setTimeout(hideError, 3000);

    return () => clearTimeout(timerId);
  }, [hideError, errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {errorMessage}
    </div>
  );
});
