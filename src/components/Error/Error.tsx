import React from 'react';
import cn from 'classnames';

type Props = {
  isHidden: boolean;
  clearErrors: () => void;
  updateError: boolean;
  addError: boolean;
  removeError: boolean;
  inputError: boolean;
};

export const ErrorMessage: React.FC<Props> = ({
  isHidden,
  clearErrors,
  updateError,
  addError,
  removeError,
  inputError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: isHidden })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearErrors}
      >
        x
      </button>

      {updateError && 'Unable to update a todo'}
      {addError && 'Unable to add a todo'}
      {removeError && 'Unable to delete a todo'}
      {inputError && 'Title can\'t be empty'}
    </div>
  );
};
