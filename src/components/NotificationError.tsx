/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { TodoError } from '../types/TodoError';
import { wait } from '../utils/fetchClient';

type Props = {
  errorMessage: TodoError,
  clearError: () => void,
};

export const NotificationError: React.FC<Props> = ({
  errorMessage,
  clearError,
}) => {
  const [isHidden, setIsHidden] = useState(true);

  const handleDeleteClick = () => {
    setIsHidden(true);
    wait(1000).then(() => clearError());
  };

  useEffect(() => {
    setIsHidden(false);
    wait(3000)
      .then(() => setIsHidden(true))
      .then(() => wait(1000).then(() => clearError()));
  }, []);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: isHidden,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleDeleteClick}
      />
      {errorMessage}
    </div>
  );
};
