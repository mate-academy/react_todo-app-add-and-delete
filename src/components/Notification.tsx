import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  errorType: ErrorType,
};

export const Notification: React.FC<Props> = ({ errorType }) => {
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const handleNotification = () => {
    setIsButtonHidden(true);
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isButtonHidden },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleNotification}
      >
        x
      </button>
      {errorType}
    </div>
  );
};
