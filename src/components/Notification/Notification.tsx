import React from 'react';
import classnames from 'classnames';

type Props = {
  message: string,
  onClose: () => void,
  hidden: boolean,
};

export const Notification: React.FC<Props> = ({
  message,
  onClose,
  hidden,
}) => {
  return (
    <div
      // className="notification is-danger is-light has-text-weight-normal"
      className={classnames(
        'notification is-danger is-light has-text-weight-normal', {
          hidden,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        aria-label="close notification"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
