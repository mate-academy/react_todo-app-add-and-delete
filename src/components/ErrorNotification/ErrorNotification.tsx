/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  error: Errors | null;
  setError: (err: Errors | null) => void;
};

export const ErrorNotification: React.FC<Props> = ({ error, setError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
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
