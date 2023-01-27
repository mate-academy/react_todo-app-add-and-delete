/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  errorMessage: string;
  close: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  close,
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
        onClick={close}
      />

      {errorMessage}
    </div>
  );
};
