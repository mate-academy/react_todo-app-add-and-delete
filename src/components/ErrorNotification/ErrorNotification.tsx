/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { memo } from 'react';

export type Props = {
  message: string
  setErrorMessage:(v:string) => void
};

export const ErrorNotification: React.FC<Props> = memo(({
  message,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />

      {message}
    </div>
  );
});
