/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string,
  onCloseErrorMessage: (newError: string) => void,
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  onCloseErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        onCloseErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={
        classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )
      }
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onCloseErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
