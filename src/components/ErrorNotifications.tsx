import classNames from 'classnames';
import React from 'react';

type Props = {
  error: boolean;
  onError: (value: boolean) => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  onError,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError(false)}
      />
      {errorMessage}
    </div>
  );
};
