import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  clearError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, clearError }) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !error },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={clearError}
    />
    {error}
  </div>
);
