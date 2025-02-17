import cn from 'classnames';
import React from 'react';

type Props = {
  errorMessage: string | null;
  errorHidden: boolean;
};

export const Errors: React.FC<Props> = ({ errorMessage, errorHidden }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorHidden,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideError"
      />

      <p>{errorMessage}</p>
    </div>
  );
};
