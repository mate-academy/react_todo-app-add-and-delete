import React from 'react';

type Props = {
  error: string;
  clearError: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, clearError }) => {
  //if (!error) {
  //  return null;
  //}

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {error}
    </div>
  );
};
