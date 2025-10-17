import cn from 'classnames';

type Props = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export const ErrorNotifications: React.FC<Props> = ({
  message,
  visible,
  onClose,
}) => {
  {
    /* DON'T use conditional rendering to hide the notification */
  }

  {
    /* Add the 'hidden' class to hide the message smoothly */
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !visible },
      )}
      role="alert"
      aria-live="assertive"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        aria-label="Close error notification"
        className="delete"
        onClick={onClose}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
