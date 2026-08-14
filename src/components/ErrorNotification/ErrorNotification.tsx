import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {errorMessage}
    </div>
  );
};
