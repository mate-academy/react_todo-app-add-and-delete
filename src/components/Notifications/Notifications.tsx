import cn from 'classnames';

type NotificationProps = {
  error: string;
  onHideError: () => void;
};

export const Notification: React.FC<NotificationProps> = ({
  error,
  onHideError,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onHideError}
      />
      {error}
    </div>
  );
};
