/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

interface Props {
  errorType: string;
  setErrorType: (error: string) => void;
}

export const ErrorMessage: React.FC<Props> = ({ errorType, setErrorType }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType('none')}
      />
      {errorType === 'add' && 'Unable to add a todo'}
      <br />
      {errorType === 'delete' && 'Unable to delete a todo'}
      <br />
      {errorType === 'update' && 'Unable to update a todo'}
    </div>
  );
};
