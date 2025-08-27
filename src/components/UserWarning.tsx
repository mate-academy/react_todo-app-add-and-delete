import React from 'react';

type Props = {
  hidden: boolean;
  message: string;
  onClose: () => void;
};

export const UserWarning: React.FC<Props> = ({ hidden, message, onClose }) => {
  return (
    <div
      className={`notification ${hidden ? 'hidden' : ''}`}
      data-cy="ErrorNotification"
      role="alert"
      aria-hidden={hidden}
    >
      <button
        type="button"
        className="delete"
        data-cy="HideErrorButton"
        aria-label="Hide error"
        onClick={onClose}
      />
      <span>{message}</span>
    </div>
  );
};
