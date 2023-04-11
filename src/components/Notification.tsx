import React from 'react';

interface Props {
  error: string,
  onClose: () => void,
}

export const Notification: React.FC<Props> = ({ error, onClose }) => {
  return (
    <div
      className="notification is-danger is-light has-text-weight-normal"
      hidden={!error}
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
        aria-label="toggle-button"
      />

      {error}
    </div>
  );
};
