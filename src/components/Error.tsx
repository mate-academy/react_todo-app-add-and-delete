import React from 'react';
import classNames from 'classnames';

type Props = {
  isError: boolean;
  setError: (error: boolean) => void;
  messageError: string;
};

export const Error: React.FC<Props> = ({
  isError,
  setError,
  messageError,
}) => {
  if (isError) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="close message error"
        type="button"
        className="delete"
        onClick={() => setError(false)}
      />

      {messageError}
    </div>

  );
};
