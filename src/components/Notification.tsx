/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

export const Notification: React.FC = () => {
  const [hidden, setHidden] = useState(false);

  const deleteHandler = () => {
    setHidden(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setHidden(true);
    }, 3000);
  }, []);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={deleteHandler}
      />
    </div>
  );
};
