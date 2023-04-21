/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorAction } from '../../types/ErrorAction';
import { getErrorMessage } from '../../utils/helpers';

type Props = {
  action: ErrorAction;
  resetError: () => void;
};

export const NotificationError: React.FC<Props> = ({ action, resetError }) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);
  const errorMessage = getErrorMessage(action);

  useEffect(() => {
    setTimeout(() => {
      setIsNotificationVisible(false);
      resetError();
    }, 3000);
  }, []);

  return (
    <>
      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isNotificationVisible },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => {
            setIsNotificationVisible(false);
          }}
        />

        {errorMessage}
      </div>
    </>
  );
};
