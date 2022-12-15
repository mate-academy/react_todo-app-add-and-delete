import React from 'react';
import classNames from 'classnames';
import { Notifications } from '../types/Notifications';

interface Props {
  notification: Notifications,
  resetNotification: () => void,
}

export const ErrorNotification:React.FC<Props> = ({
  notification,
  resetNotification,
}) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !notification },
    )}
  >
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={resetNotification}
    />
    {notification}
  </div>
);
