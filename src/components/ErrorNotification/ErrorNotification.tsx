import React from 'react';
import classNames from 'classnames';

interface Props {
  hasError: boolean;
  errorMessage: string;
  closeErrorNotification: () => void;
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  hasError,
  errorMessage,
  closeErrorNotification,
}) => (
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
      aria-label="HideErrorButton"
      onClick={closeErrorNotification}
    />

    {errorMessage}
  </div>
));
