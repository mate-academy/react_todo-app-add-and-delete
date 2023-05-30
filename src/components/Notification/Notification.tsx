import React, { useEffect } from 'react';
import './Notification.scss';
import classNames from 'classnames';

type Props = {
  isErrorMessage: boolean
  closeErrorMessage: () => void
  errorMessage: string | null
};

export const Notification: React.FC<Props> = ({
  isErrorMessage,
  closeErrorMessage,
  errorMessage,
}) => {
  const isHidden = !isErrorMessage;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (!isHidden) {
      timeoutId = setTimeout(() => {
        closeErrorMessage();
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHidden, closeErrorMessage]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: isHidden,
        },
      )}
    >
      <button
        aria-label="deleteButton"
        type="button"
        className="delete"
        onClick={closeErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
