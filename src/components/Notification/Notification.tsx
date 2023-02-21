import React, { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  error: ErrorMessage,
  closeNotification: () => void,
};

export const Notification: React.FC<Props> = ({ error, closeNotification }) => {
  useEffect(() => {
    if (error !== ErrorMessage.None) {
      setTimeout(closeNotification, 3000);
    }
  }, [error]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: error === ErrorMessage.None },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={closeNotification}
      />
      {error}
    </div>
  );
};
