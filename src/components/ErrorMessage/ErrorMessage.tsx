/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

interface Props {
  message: string
  onClose: () => void
}

export const ErrorMessage: React.FC<Props> = React.memo(
  ({ message, onClose }) => {
    return (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onClose}
        />
        {message}
        <br />
      </div>
    );
  },
);
