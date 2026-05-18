// .. ErrorNotification.tsx

//  DON'T use conditional rendering to hide the notification */
//  Add the 'hidden' class to hide the message smoothly */

interface ErrorNotificationProps {
  errorMessage: string;
  onClose: () => void;
}

export const ErrorNotification = ({
  errorMessage,
  onClose,
}: ErrorNotificationProps) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={
        errorMessage
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
      {errorMessage}
    </div>
  );
};
