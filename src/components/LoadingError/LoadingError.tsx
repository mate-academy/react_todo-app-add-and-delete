import React from 'react';

type Props = {
  error: string;
  setError: (parameter: string | null) => void,
};

export const LoadingError: React.FC<Props> = ({ error, setError }) => {
  const hideError = () => {
    setError(null);
  };

  if (error) {
    setTimeout(() => {
      setError('');
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
        aria-label="delete"
        onClick={hideError}
      />

      {error && 'Unable to add a todo'}
    </div>
  );
};
