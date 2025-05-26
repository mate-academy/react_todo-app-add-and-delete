import React from 'react';

interface ErrorNotificationProps {
  errorMessage: string | null;
  onHideError: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  onHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${
        errorMessage ? '' : 'hidden'
      }`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError} // Переконайтеся, що у вас є ця функція
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
