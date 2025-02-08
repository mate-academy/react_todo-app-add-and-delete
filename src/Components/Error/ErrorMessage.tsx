import React, { useEffect } from 'react';

type Props = {
  onClear: () => void;
  error: string | null;
};

export const ErrorMessage: React.FC<Props> = ({ onClear, error }) => {
  useEffect(() => {}, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClear()}
      />
      {error}
    </div>
  );
};
