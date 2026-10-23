import cn from 'classnames';
import React, { useEffect } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorMessage: string;
  onErrorMessageChange: (errorMessage: ErrorMessage) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessageChange,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(
      () => onErrorMessageChange(ErrorMessage.noError),
      3000,
    );

    return () => clearTimeout(timerId);
  }, [errorMessage, onErrorMessageChange]);

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
        onClick={() => onErrorMessageChange(ErrorMessage.noError)}
      />
      {errorMessage}
    </div>
  );
};
