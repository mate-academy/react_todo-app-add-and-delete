import React from 'react';

type Props = {
  deleteErrors: () => void;
  errorMessage: string;
};

export const ErrorNotification: React.FC<Props>
= React.memo(({ deleteErrors, errorMessage }) => (
  <div
    data-cy="ErrorNotification"
    className="notification is-danger is-light has-text-weight-normal"
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={deleteErrors}
    />
    {errorMessage}
  </div>
));
