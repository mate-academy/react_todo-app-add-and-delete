import classNames from 'classnames';
import React, { useState } from 'react';

type Props = {
  message: string,
};

export const Notification: React.FC<Props> = ({ message }) => {
  const [isHidden, setIsHiden] = useState(false);

  setTimeout(() => {
    setIsHiden(true);
  }, 3000);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal', {
        hidden: isHidden,
      },
    )}
    >
      <button
        type="button"
        className="delete"
        aria-label="delete"
        onClick={() => setIsHiden(true)}
      />
      {message}
    </div>
  );
};
