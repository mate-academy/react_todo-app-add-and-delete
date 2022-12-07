/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  error: string,
  setError: (error: string) => void
};

export const ErrorType: React.FC<Props> = ({ error, setError }) => {
  const errorHandler = () => {
    setError('');
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
        onClick={errorHandler}
      />
      {error}
    </div>
  );
};
