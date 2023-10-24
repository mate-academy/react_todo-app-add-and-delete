/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  message: string;
  resetMessage: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  message,
  resetMessage,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message.length },
      )}
    >
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={resetMessage}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
