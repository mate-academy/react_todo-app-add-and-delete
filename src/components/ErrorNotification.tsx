import cn from 'classnames';
type ErrorNotificationProps = {
  notification: string;
  onClear: () => void;
};

export function ErrorNotification({
  notification,
  onClear,
}: ErrorNotificationProps) {
  const hideNotification = notification === '';

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: hideNotification,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClear}
      />

      {notification}
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
}
