import { ErrorNotificationsProps } from '../../types/ErrorNotificationsProps';

export const ErrorNotif: React.FC<ErrorNotificationsProps> = ({
  isVisible,
  message,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${!isVisible ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
