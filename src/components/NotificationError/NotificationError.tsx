/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  errorReset: () => void,
  errorMessage: ErrorMessage,
};

export const NotificationError: React.FC<Props> = ({
  errorReset,
  errorMessage,
}) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsNotificationVisible(false);
      errorReset();
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

        {errorMessage === ErrorMessage.TITLEEMPTY
          ? errorMessage
          : `Unable to ${errorMessage} a todo`}
      </div>
    </>
  );
};
