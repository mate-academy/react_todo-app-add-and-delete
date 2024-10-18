import React from 'react';
import cn from 'classnames';
import { Errors } from '../../utils/Errors';

interface Props {
  errorMessage: Errors;
  onErrorMessageChange: (error: Errors) => void;
}

export const ErrorsField: React.FC<Props> = ({
  errorMessage,
  onErrorMessageChange,
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
        onClick={() => onErrorMessageChange(Errors.Default)}
      />
      {errorMessage}
    </div>
  );
};
