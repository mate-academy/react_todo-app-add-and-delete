import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string | null;
  isErrorHidden: boolean;
  setIsErrorHidden: (isErrorHidden: boolean) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isErrorHidden,
  setIsErrorHidden,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage || isErrorHidden,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsErrorHidden(true)}
      />
      {errorMessage}
    </div>
  );
};
