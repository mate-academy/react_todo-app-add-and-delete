import React, { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  message: string;
  clearError: () => void;
}

export const Errors: React.FC<Props> = ({ message, clearError }) => {
  useEffect(() => {
    const timeOut = setTimeout(clearError, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [message]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
