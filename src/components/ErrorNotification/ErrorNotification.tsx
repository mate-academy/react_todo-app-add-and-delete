/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { memo } from 'react';

export type Props = {
  errorMessage: string
  setErrorMessage:(v:string) => void
};

export const ErrorNotification: React.FC<Props> = memo(({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
});
