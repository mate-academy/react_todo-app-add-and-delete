// DON'T use conditional rendering to hide the notification

import classNames from 'classnames';
import React from 'react';
import { FC } from 'react';

interface Props {
  message: string;
  onCloseNotification: (message: string) => void;
}
export const ErrorNotification: FC<Props> = ({
  message,
  onCloseNotification,
}: Props) => (
  <div
    data-cy="ErrorNotification"
    className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !message },
    )}
  >
    <button
      data-cy="HideErrorButton"
      type="button"
      className="delete"
      onClick={() => onCloseNotification('')}
    />
    {message}
  </div>
);
