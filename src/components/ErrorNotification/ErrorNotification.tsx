import React, { useState } from 'react';
import { TextError } from '../../types/TextError';

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
