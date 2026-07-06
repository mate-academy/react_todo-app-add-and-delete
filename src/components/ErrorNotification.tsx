import React from 'react';
type Props = {
  message: string;
  onClose: () => void;
};
export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={
      message
        ? 'notification is-danger is-light has-text-weight-normal'
        : 'notification is-danger is-light has-text-weight-normal hidden'
    }
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={onClose}
    />
    {/* show only one message at a time */}
    {message}
  </div>
);
