import React from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  isShowError: boolean;
  setIsShowError: (value: boolean) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  isShowError,
  setIsShowError,
}) => {
  setTimeout(() => {
    setIsShowError(false);
  }, 3000);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !isShowError,
      })}
    >
      <button
        aria-label="HideErrorButton"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setIsShowError(false)}
      />
      {errorMessage}
    </div>
  );
};
