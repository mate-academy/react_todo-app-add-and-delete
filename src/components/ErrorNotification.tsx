import cn from 'classnames';
import { ErrorType } from '../types/ErrorType';
import React from 'react';

type Props = {
  errorMessage: ErrorType;
  handleRemoveError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleRemoveError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === ErrorType.DEFAULT,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleRemoveError}
      />
      {errorMessage !== ErrorType.DEFAULT && errorMessage}
    </div>
  );
};
