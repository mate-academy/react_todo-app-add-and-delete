import React from 'react';
import classNames from 'classnames';

import './Notification.scss';

type Props = {
  notification: string;
  onHideNotification: () => void;
};

export const Notification: React.FC<Props> = ({
  notification,
  onHideNotification,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !notification },
      )}
    >
      {notification && (
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHideNotification}
        />
      )}

      {notification}
    </div>
  );
};
