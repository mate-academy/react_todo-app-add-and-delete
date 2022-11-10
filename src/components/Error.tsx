import React from 'react';
import classNames from 'classnames';

type Props = {
  hidden: boolean,
  onCloseErrors: () => void,
  errorMessage: string | null,
};

export const Error:React.FC<Props> = React.memo(({
  hidden,
  onCloseErrors,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseErrors}
        aria-label="button-hide Errors"
      />

      {errorMessage}
    </div>
  );
});
