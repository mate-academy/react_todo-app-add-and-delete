import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  errorType: string | null;
  handleCloseError: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorType,
  handleCloseError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorType,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseError}
      />
      {errorType}
    </div>
  );
};

export default ErrorNotification;
