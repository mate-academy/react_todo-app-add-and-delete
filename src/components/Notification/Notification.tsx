import cn from 'classnames';
import { useEffect, useState } from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { useTodoContext } from '../../context/TodoContext';

export const NotificationModal = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const { error, setError } = useTodoContext();

  useEffect(() => {
    if (error) {
      setNotificationVisible(true);
    } else {
      setNotificationVisible(false);
    }
  }, [error]);

  return (
    <div
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !notificationVisible },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close notification"
        onClick={() => {
          setNotificationVisible(false);
          setError(null);
        }}
      />
      {/* show only one message at a time */}
      {error === ErrorMessages.DOWNLOAD && <span>Unable to download</span>}

      {error === ErrorMessages.ADD && <span>Unable to add a todo</span>}

      {error === ErrorMessages.DELETE && <span>Unable to delete a todo</span>}

      {error === ErrorMessages.UPDATE && <span>Unable to update a todo</span>}

      {error === ErrorMessages.EMPTY && <span>Title should not be empty</span>}
    </div>
  );
};
