import { ErrorMessages, ErrorNotificationsProps } from '../types/Types';

export const ErrorNotifications: React.FC<ErrorNotificationsProps> = ({
  errorMessage,
  setErrorMessage,
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
        onClick={() => setErrorMessage(ErrorMessages.empty)}
      />
      {errorMessage}
    </div>
  );
};
