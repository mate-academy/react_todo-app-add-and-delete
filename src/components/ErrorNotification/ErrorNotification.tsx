import React from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        errorMessage === ''
          ? 'notification is-danger is-light has-text-weight-normal hidden'
          : 'notification is-danger is-light has-text-weight-normal'
      }
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
