import React from 'react';
import classNames from 'classnames';

type ErrorNotificationProps = {
  errorMessage: string | null;
  clearErrorMessage: () => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  clearErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
