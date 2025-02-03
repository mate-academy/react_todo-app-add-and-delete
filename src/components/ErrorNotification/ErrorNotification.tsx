import React, { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  errorMessage: string;
  onCloseErrorMessage: () => void;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseErrorMessage,
}) => {
  useEffect(() => {
    const timeout = setTimeout(onCloseErrorMessage, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
