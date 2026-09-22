import React from 'react';
import cn from 'classnames';

type Props = {
  hasError: boolean;
  errorMsg: string;
  setHasError: (value: boolean) => void;
};
export const ErrorNotification = ({
  hasError,
  errorMsg,
  setHasError,
}: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: hasError === false,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHasError(false)}
      />
      {/* show only one message at a time */}
      {errorMsg}
    </div>
  );
};
