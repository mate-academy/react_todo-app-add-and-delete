import React from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import cn from 'classnames';

type Props = {
  errorMessage: ErrorMessages;
  onErrorMessage: (errorMessage: ErrorMessages) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
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
        onClick={() => onErrorMessage(ErrorMessages.None)}
      />
      {errorMessage}
    </div>
  );
};
