import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { NOTIFICATION } from '../../types/Notification';
/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  notification: NOTIFICATION;
};

export const Notifications: React.FC<Props> = ({ notification }) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsHidden(true);
    }, 3000);
  }, []);

  return (
    <div
      className={
        classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: isHidden,
        })
      }
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {notification}
    </div>
  );
};
