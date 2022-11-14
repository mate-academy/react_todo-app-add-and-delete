import React from 'react';

type Props = {
  errorMessage: string;
  setErrorStatus: () => void;
};

export const ErrorNote: React.FC<Props> = ({
  errorMessage,
  setErrorStatus,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close"
        onClick={setErrorStatus}
      />
      {errorMessage}
    </div>
  );
};
