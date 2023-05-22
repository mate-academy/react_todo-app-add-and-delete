import React from 'react';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  error: ErrorType;
  onCloseError: () => void;
}

export const Notifications: React.FC<Props> = ({ error, onCloseError }) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        onClick={onCloseError}
        aria-label="delete"
      />

      {error}

    </div>
  );
};
