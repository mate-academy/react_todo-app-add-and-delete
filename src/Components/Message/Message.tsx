import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorType: string,
  isError: boolean,
  clearNotification: () => void,
};
export const Message: React.FC<Props> = (
  {
    errorType,
    isError,
    clearNotification,
  },
) => {
  useEffect(() => {
    const timerId = window.setTimeout(() => clearNotification(), 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isError]);

  return (
    <div
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isError,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={clearNotification}
      />
      {`Unable to ${errorType} a todo`}
    </div>
  );
};
