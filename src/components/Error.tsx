import React from 'react';
import { Errors } from '../types/EnumedErrors';

type Props = {
  error: string;
  setError: (error: Errors) => void;
};

export const Error = ({ error, setError }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(Errors.NoLetters)}
      />
      <div>{error}</div>
    </div>
  );
};
