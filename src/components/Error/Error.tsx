import classNames from 'classnames';
import React from 'react';

type Props = {
  isError: boolean,
  closeError: () => void,
  error: string,
};

export const Error:React.FC <Props> = ({ isError, closeError, error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden: !isError,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close Error"
        onClick={closeError}
      />

      {error}
    </div>
  );
};
