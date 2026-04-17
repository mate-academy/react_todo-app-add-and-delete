import React from 'react';
import classNames from 'classnames';
import { NotificationMessage } from '../types/Notifications';

type Props = {
  notification: { message: NotificationMessage | null; visible: boolean };
  hideNotification: () => void;
};
export const ErrorNotification: React.FC<Props> = ({
  notification,
  hideNotification,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !notification.visible,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideNotification}
      />
      {notification.message}
    </div>
  );
};
