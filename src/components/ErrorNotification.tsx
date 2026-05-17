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
      {/* show only one message at a time */}
      {/* Unable to load todos */}
      {errorMessage}
      {/* <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
