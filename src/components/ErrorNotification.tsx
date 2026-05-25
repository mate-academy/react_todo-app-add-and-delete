import cn from 'classnames';

type ErrorNotificationProps = {
  notification: string;
  onClose: () => void;
};

export function ErrorNotification({
  notification,
  onClose,
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
        onClick={onClose}
      />

      {notification}
    </div>
  );
}
