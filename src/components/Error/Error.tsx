/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  error: string,
  setErrorType: (error: string) => void,
};

export const Error: React.FC<Props> = ({ error, setErrorType }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType('')}
      />
      {error}
    </div>
  );
};
