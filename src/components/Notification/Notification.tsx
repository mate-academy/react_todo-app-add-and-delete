import React from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  error: ErrorType,
  onClose: () => void,
};

export const Notification: React.FC<Props> = ({ error, onClose }) => (
  <div className="notification is-danger is-light has-text-weight-normal">
    <button
      type="button"
      className="delete"
      onClick={onClose}
      aria-label="Dismiss error message"
    />

    {error}

  </div>
);
