import { FC } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/Error';

interface NotificationProps {
  error: ErrorType;
  onRemoveError: () => void;
}

export const Notification: FC<NotificationProps> = ({
  error,
  onRemoveError,
}) => {
  return (
    <div className={classNames(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal', {
        hidden: !error,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="close the notification"
        onClick={onRemoveError}
      />

      {`Unable to ${error} a todo`}
    </div>
  );
};
