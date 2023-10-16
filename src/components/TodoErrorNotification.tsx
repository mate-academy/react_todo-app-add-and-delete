type ErrorNotificationProps = {
  errorMessage: string;
  setErrorMessage: (message: string) => void;
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorMessage,
  setErrorMessage,
}) => {
  if (errorMessage) {
    setTimeout(() => setErrorMessage(''), 3000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage.length === 0 ? 'hidden' : ''}`}
    >
      <button
        aria-label="error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage}
      />
      {errorMessage}
    </div>
  );
};
