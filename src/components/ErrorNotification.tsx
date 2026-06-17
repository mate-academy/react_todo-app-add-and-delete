import React from 'react';

type Prop = {
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
};

export const ErrorNotification: React.FC<Prop> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
