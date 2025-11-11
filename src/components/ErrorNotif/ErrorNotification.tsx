import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  isErrorVisible: boolean;
  errorMessage: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  isErrorVisible,
  errorMessage,
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
        { hidden: !isErrorVisible },
      )}
    >
      {errorMessage && (
        <>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={onClose}
          />
          {errorMessage}
        </>
      )}
    </div>
  );
};
