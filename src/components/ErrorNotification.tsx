import React from 'react';
import classNames from 'classnames';

type ErrorProps = {
  onClose: () => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<ErrorProps> = ({
  onClose,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: errorMessage === '',
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClose()}
      />
      {errorMessage}
    </div>
  );
};
