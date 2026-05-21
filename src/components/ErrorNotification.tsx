import React from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  clearError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  clearError,
}) => {
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
        onClick={clearError}
      />

      {errorMessage}
    </div>
  );
};
