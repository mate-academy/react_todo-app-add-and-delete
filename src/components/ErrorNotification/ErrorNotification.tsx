import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  message: string;
  hidden: boolean;
  hideMessage: () => void;
};

const ErrorNotificationBase: React.FC<Props> = ({
  message,
  hidden,
  hideMessage,
}) => {
  const timerId = useRef(0);

  const closeNotification = () => {
    hideMessage();
  };

  useEffect(() => {
    clearTimeout(timerId.current);
    if (!hidden) {
      timerId.current = window.setTimeout(() => {
        hideMessage();
      }, 3_000);
    }

    return () => {
      clearTimeout(timerId.current);
    };
  }, [hideMessage, message, hidden]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: hidden,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={closeNotification}
      />
      {message}
    </div>
  );
};

export const ErrorNotification = React.memo(ErrorNotificationBase);
