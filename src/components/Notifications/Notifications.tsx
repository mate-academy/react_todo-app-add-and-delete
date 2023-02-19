import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  errorType: ErrorType,
  hasError: boolean,
  clearNotification: () => void,
};

export const Notifications: React.FC<Props> = React.memo(({
  errorType,
  hasError,
  clearNotification,
}) => {
  useEffect(() => {
    const timerId = window.setTimeout(() => clearNotification(), 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [hasError]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        type="button"
        aria-label="error"
        className="delete"
        onClick={clearNotification}
      />
      {errorType}
    </div>
  );
});
