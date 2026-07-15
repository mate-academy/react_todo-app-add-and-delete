import React from 'react';

interface Props {
  message: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!message ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
