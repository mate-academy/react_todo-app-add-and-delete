import cn from 'classnames';
import { useEffect } from 'react';

interface ErrorNotificationProps {
  error: string | null;
  setError: (error: string | null) => void;
  onHideError: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  setError,
  onHideError,
}) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer); // Evita errores si el componente cambia antes de que pasen los 3s
    }

    return;
  }, [error, setError]);

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
        className={error ? 'delete' : 'hidden'}
        onClick={() => onHideError()}
      />
      {error}
    </div>
  );
};
