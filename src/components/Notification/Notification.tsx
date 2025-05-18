import cn from 'classnames';

interface NotificationProps {
  errorMessage: string;
  onClearMessage: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  errorMessage,
  onClearMessage,
}) => {
  return (
    <>
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onClearMessage}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </>
  );
};
