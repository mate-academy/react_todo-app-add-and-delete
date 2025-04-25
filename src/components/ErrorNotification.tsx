import React from 'react';

interface ErrorNotificationProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  setError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${error === '' ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};

export default ErrorNotification;
