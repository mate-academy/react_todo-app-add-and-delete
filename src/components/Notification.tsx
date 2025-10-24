import cn from 'classnames';

type Props = {
  message: string | null;
  onClose: () => void;
};

export const Notification: React.FC<Props> = ({ message, onClose }) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !message },
    )}
    role="alert"
    aria-live="polite"
    aria-hidden={!message}
  >
    {message && (
      <>
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onClose}
          aria-label="Hide error notification"
        />
        {message}
      </>
    )}
  </div>
);
