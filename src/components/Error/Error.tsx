import React from 'react';

type Props = {
  errorMessage: string,
  closeErrorMassage: () => void,
};

export const Error: React.FC<Props> = ({ errorMessage, closeErrorMassage }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        aria-label="delete"
        type="button"
        className="delete"
        onClick={closeErrorMassage}
      />
      {errorMessage}
    </div>
  );
};
