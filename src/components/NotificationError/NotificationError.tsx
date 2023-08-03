/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect } from 'react';

type Props = {
  error: string | null,
  setError: (error: string | null) => void,
  onCloseError: () => void,
};

export const NotificationError: React.FC<Props> = ({
  error,
  setError,
  onCloseError,
}) => {
  useEffect(() => {
    const hideNotification = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(hideNotification);
  }, [error]);

  return (
    <div className="
      notification
      is-danger
      is-light
      has-text-weight-normal"
    >
      <button
        type="button"
        className="delete hidden"
        onClick={onCloseError}
      />

      {error}
    </div>
  );
};
