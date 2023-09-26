/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  onCloseMessage: (newMessage: string) => void;
};
export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onCloseMessage,
}) => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      onCloseMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const notificationClasses = classNames(
    'notification',
    'is-danger',
    'is-light',
    'has-text-weight-normal',
    { hidden: !errorMessage },
  );

  return (
    <div
      data-cy="ErrorNotification"
      className={notificationClasses}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseMessage('')}
      />
      {errorMessage}
    </div>
  );
};
