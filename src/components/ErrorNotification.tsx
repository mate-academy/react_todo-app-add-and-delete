import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, onClose }) => {
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
        onClick={onClose}
      />

      {error}
    </div>
  );
};
