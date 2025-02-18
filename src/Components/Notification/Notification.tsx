import classNames from 'classnames';
import { useNotification } from '../../Context/NotificationContext';

export const Notification = () => {
  const { message, isVisible, hideNotification } = useNotification();

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames('error-notification', { hidden: !isVisible })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="close-btn"
        onClick={hideNotification}
      >
        {message}
      </button>
    </div>
  );
};
