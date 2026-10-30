import React from 'react';
import classNames from 'classnames';

type Props = {
  responseError: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  responseError,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !responseError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {responseError}
    </div>
  );
};
