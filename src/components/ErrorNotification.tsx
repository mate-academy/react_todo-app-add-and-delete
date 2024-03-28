import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  showError: (error: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, showError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => showError('')}
      />
      {error}
    </div>
  );
};
