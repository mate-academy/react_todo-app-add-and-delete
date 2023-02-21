import React from 'react';
import cn from 'classnames';
import { ErrorType } from '../../types/ErrorType';

interface Props {
  errorType: ErrorType;
  onCloseNotification: () => void
}

export const Notification: React.FC<Props> = ({
  errorType,
  onCloseNotification,
}) => (
  <div className={cn(
    'notification is-danger is-light has-text-weight-normal',
    { hidden: !errorType },
  )}
  >
    <button
      type="button"
      className="delete"
      aria-label="deleteNotification"
      onClick={onCloseNotification}
    />

    {errorType}
  </div>
);
