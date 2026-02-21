import React from 'react';

type Props = {
  message: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${message ? '' : 'hidden'}`}
    >
      {message}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
    </div>
  );
};
