import React, { useEffect } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import classNames from 'classnames';

type Props = {
  errorMessage: ErrorMessage | null;
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

    const timerId = window.setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
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
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
