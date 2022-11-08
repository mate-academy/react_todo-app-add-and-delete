import React from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean
  onClose: () => void
  children: string
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  hasError,
  onClose,
  children,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: !hasError,
      },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      aria-label="Error button"
      onClick={onClose}
    />

    {children}
  </div>
));
