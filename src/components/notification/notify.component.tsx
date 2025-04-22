import React from 'react';

import classNames from 'classnames';
import { NotificationTypes } from './notification.types';

export const NotifyComponent: React.FC<NotificationTypes> = ({
  closeModal,
  errorMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        onClick={closeModal}
        data-cy="HideErrorButton"
        type="button"
        className="delete"
      />
      {errorMessage}
    </div>
  );
};
