import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  handleErrorNotifications: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  handleErrorNotifications,
}) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => handleErrorNotifications(), 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
        onClick={handleErrorNotifications}
      />
      {error}
    </div>
  );
};
