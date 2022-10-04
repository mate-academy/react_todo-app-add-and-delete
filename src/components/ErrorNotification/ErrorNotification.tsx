/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  error: string | null,
  setError: CallableFunction,
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!error}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(null)}
      />
      {error}
    </div>
  );
};
