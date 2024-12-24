import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  onClearError: (v: string) => void;
};

export const Errors: React.FC<Props> = ({ error, onClearError }) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        onClearError('');
      }, 3000);
    }
  }, [error, onClearError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === '',
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClearError('')}
      />
      {error}
    </div>
  );
};
