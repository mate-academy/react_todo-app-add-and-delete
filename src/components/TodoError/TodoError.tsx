import React from 'react';

type Props = {
  message?: string;
  onCloseError: () => void;
};

export const TodoError: React.FC<Props> = ({ message, onCloseError }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onCloseError}
      />

      {message || 'Sorry, smth unexpected happend'}
    </div>
  );
};
