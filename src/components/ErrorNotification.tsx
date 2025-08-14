import React from 'react';
import classNames from 'classnames';

interface Props {
  error: string;
  onErrorClose: (error: string) => void;
}

export const ErrorNotification: React.FC<Props> = ({ error, onErrorClose }) => {
  return (
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
        onClick={() => onErrorClose('')}
        aria-label="Hide error message"
      />
      {error}
    </div>
  );
};
