import React, { useEffect, useState } from 'react';

interface ErrorNotificationProps {
  error: string | null;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
}) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (error) {
      setHidden(false);
      const timer = setTimeout(() => {
        setHidden(true);
      }, 4000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${hidden ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setHidden(true)}
      />
      {error}
    </div>
  );
};
