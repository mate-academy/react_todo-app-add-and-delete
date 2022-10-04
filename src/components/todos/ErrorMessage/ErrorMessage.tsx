/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Error } from '../../../types/Error';

interface Props {
  error: string;
  setError: (error: Error) => void;
}

export const ErrorMessage: React.FC<Props> = ({ error, setError }) => {
  if (error) {
    setTimeout(() => {
      setError(Error.None);
    }, 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Error.None)}
      />

      {error}
    </div>
  );
};
