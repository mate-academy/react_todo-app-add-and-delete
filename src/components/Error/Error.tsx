import classNames from 'classnames';
import React, { useEffect } from 'react';
import { ErrorNotification } from '../../types/ErrorNotification';

type Props = {
  error: ErrorNotification;
  onErrorChange: (error: ErrorNotification) => void;
};

export const Error: React.FC<Props> = ({ error, onErrorChange }) => {
  useEffect(() => {
    setTimeout(() => {
      onErrorChange(ErrorNotification.None);
    }, 3000);
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: error === ErrorNotification.None,
        })}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorChange(ErrorNotification.None)}
      />
      {error}
    </div>
  );
};
