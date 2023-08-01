/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import classNames from 'classnames';

type Props = {
  notification: string,
  setNotification: (notification: string) => void,
};

export const ErrorNotification: React.FC<Props> = ({
  notification,
  setNotification,
}) => {
  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: notification === '' },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setNotification('')}
      />
      {notification}
    </div>
  );
};
