import React from 'react';
import classNames from 'classnames';

interface Props {
  hasError: boolean;
  closeNotification: () => void;
  children: string,
}

export const ErrorNotification: React.FC<Props> = React.memo(({
  hasError,
  closeNotification,
  children,
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
      aria-label="Close notification"
      className="delete"
      onClick={closeNotification}
    />
    {children}
  </div>
));
