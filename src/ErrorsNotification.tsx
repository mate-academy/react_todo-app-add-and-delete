import React from 'react';

type Props = {
  error: string,
  onCloseError: () => void,
};

export const ErrorsNotification: React.FC<Props> = ({
  error,
  onCloseError,
}) => {
  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        aria-label="Close"
        type="button"
        className="delete"
        onClick={() => onCloseError()}
      />
      <span>{error}</span>
    </div>
  );
};
