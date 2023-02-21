import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  error: ErrorTypes,
};

export const Notification: React.FC<Props> = ({
  error,
}) => {
  const [isHidden, setIsHidden] = useState(true);

  const hideNotification = () => {
    window.setTimeout(() => {
      setIsHidden(true);
    }, 3000);
  };

  useEffect(() => {
    setIsHidden(false);

    return hideNotification();
  }, [error]);

  return (
    <div className={
      classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )
    }
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="delete"
        onClick={() => {
          setIsHidden(true);
        }}
      />
      {error}
    </div>
  );
};
