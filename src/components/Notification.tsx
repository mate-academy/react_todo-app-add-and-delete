/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { ErrorTypes } from '../types/ErrorTypes';

type NotificationProps = {
  message: ErrorTypes,
  onButtonClick: () => void
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  onButtonClick,
}) => {
  return (
    <div className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal', {
        hidden: !message,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={onButtonClick}
      />
      {message}
    </div>
  );
};
