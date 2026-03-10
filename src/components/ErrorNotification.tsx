import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMsg: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ errorMsg, onClose }) => {
  useEffect(() => {
    if (!errorMsg) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMsg, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMsg },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMsg}
    </div>
  );
};
