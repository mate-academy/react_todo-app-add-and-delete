import classNames from 'classnames';
import { useCallback, useEffect, useRef } from 'react';

type NotificationProps = {
  isError: boolean;
  errorId: number;
  errors: string[];
  setNotificationIsHide: (value: boolean) => void;
  notificationIsHide: boolean;
};

export const ErrorNotification: React.FC<NotificationProps> = ({
  isError,
  errors,
  notificationIsHide,
  setNotificationIsHide,
  errorId,
}) => {
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const errorHide = useCallback(() => {
    setNotificationIsHide(false);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setNotificationIsHide(true);
    }, 3000);
  }, [setNotificationIsHide]);

  useEffect(() => {
    if (isError) {
      errorHide();
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [errorHide, errorId, isError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: notificationIsHide },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setNotificationIsHide(true);
        }}
      />
      {/* show only one message at a time */}
      {errors.map((error, index) => (
        <span key={index}>
          {error}
          <br />
        </span>
      ))}
    </div>
  );
};
