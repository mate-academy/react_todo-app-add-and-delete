/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { NotificationText } from '../../types/enums';

interface Props {
  text: NotificationText | null,
  hideNotification: () => void;
}

export const Notification: React.FC<Props> = ({
  text,
  hideNotification,
}) => (
  <div className={
    classNames('notification is-danger is-light has-text-weight-normal', {
      hidden: !text,
    })
  }
  >
    <button
      type="button"
      className="delete"
      onClick={() => hideNotification()}
    />
    {text}
  </div>
);
