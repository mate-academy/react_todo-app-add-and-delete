import classNames from 'classnames';
import { useEffect } from 'react';

type NotificationProps = {
  error: string;
  setError: (error: string) => void;
};

export const Notification: React.FC<NotificationProps> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    let timer: number;

    if (error) {
      timer = window.setTimeout(() => {
        setError('');
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [error, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};
