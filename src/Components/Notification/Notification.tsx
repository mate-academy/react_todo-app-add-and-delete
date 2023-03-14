import classNames from 'classnames';
import React, { useEffect } from 'react';

import { Errors } from '../../types/Errors';
import { filterMessage } from '../../utils/filterError';

type Props = {
  errorMessage: Errors | null;
  onCloseError: () => void;
};

const Notification: React.FC<Props> = ({
  errorMessage,
  onCloseError,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        onCloseError();
      }, 3000);
    }
  });

  const showNotification = errorMessage && filterMessage(errorMessage);

  return (
    <div
      className={
        classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )
      }
    >
      <button
        type="button"
        className="delete"
        aria-label="close error"
        onClick={onCloseError}
      />

      {showNotification}
    </div>
  );
};

export default Notification;
