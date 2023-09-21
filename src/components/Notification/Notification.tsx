import { useEffect } from 'react';

type Props = {
  error: string;
  closeNotification: () => void;
};

export const Notification: React.FC<Props> = (
  { error, closeNotification },
) => {
  useEffect(() => {
    const timeout = setTimeout(closeNotification, 3000);

    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        aria-label="close notification"
        onClick={closeNotification}
      />
      {error}
    </div>
  );
};
