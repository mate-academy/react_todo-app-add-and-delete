import React from 'react';
import EError from '../utils/EError';

interface IErrorMessage {
  errorMessage: EError | null;
  setErrorMessage: (message: EError | null) => void;
}

export const ErrorMessage: React.FC<IErrorMessage> = ({
  errorMessage,
  setErrorMessage,
}) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => setErrorMessage(null)}
    />

    {errorMessage}
  </div>
);
