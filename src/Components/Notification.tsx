import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

interface NotificationPropsType {
  hasErrorFromServer: boolean,
  clearNotification: () => void,
  errorMessage: string,
}

export const Notification: React.FC<NotificationPropsType> = ({
  hasErrorFromServer,
  clearNotification,
  errorMessage,
}) => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (hasErrorFromServer) {
      setHidden(false);
      const timerId = window.setTimeout(() => {
        setHidden(true);
        clearNotification();
        window.clearTimeout(timerId);
      }, 3000);
    } else {
      setHidden(true);
    }
  });

  return (
    <div className={classNames(
      'notification is-danger is-light',
      { hidden },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="Add todo"
        onClick={() => clearNotification()}
      />

      {errorMessage === 'Title can\'t be empty'
        ? 'Title can\'t be empty'
        : `Unable to ${errorMessage} a todo`}
      <br />
    </div>
  );
};
