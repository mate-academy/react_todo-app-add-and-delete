import React from 'react';

type Props = {
  message: string;
  onClose?: () => void;
};

export const UserWarning: React.FC<Props> = ({ message = '', onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={`notification is-danger is-light has-text-weight-normal ${message ? '' : 'hidden'}`}
  >
    <button
      type="button"
      data-cy="HideErrorButton"
      className="delete"
      aria-label="close notification"
      onClick={onClose}
    />
    {message}
  </div>
);
