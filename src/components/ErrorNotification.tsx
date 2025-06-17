import { useEffect } from 'react';
import classNames from 'classnames';
import { TodoError } from '../types/typedefs';
interface ErrorNotificationProps {
  error?: string | null;
  setError: (error: TodoError | null) => void;
}

const ERROR_DURATION = 3000;

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(null);
    }, ERROR_DURATION);

    return () => clearTimeout(timer);
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
        onClick={() => {
          setError(null);
        }}
      />
      {error}
    </div>
  );
};
