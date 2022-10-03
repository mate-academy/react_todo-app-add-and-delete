import React, { useState } from 'react';

export enum TextError {
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  Title = 'Please add valid title',
  Data = 'Unable to load data',
  noUser = 'No user found',
}

type Props = {
  error: TextError;
  setError: (errorMessage: TextError | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  const [errorText] = useState(TextError.Add);

  const closeError = () => {
    setError(null);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="closeError"
        onClick={closeError}
      />

      {error && errorText}
    </div>
  );
};
