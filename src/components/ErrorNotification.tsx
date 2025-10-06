import React from 'react';
import classNames from 'classnames';

interface Props {
  error: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !error },
    )}
  >
    <button
      type="button"
      className="delete"
      data-cy="HideErrorButton"
      onClick={onClose}
    />
    {error}
  </div>
);
