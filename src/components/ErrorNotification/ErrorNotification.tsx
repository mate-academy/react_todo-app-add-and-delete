import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  message: string;
  hidden: boolean;
};

const ErrorNotificationBase: React.FC<Props> = ({ message, hidden }) => {
  const [isHidden, setIsHidden] = React.useState(hidden);
  const timerId = useRef(0);

  const closeNotification = () => {
    setIsHidden(true);
  };

  useEffect(() => {
    setIsHidden(hidden);
  }, [hidden]);

  useEffect(() => {
    clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      setIsHidden(true);
    }, 3_000);

    return () => {
      clearTimeout(timerId.current);
    };
  }, [hidden, message]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: isHidden,
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
