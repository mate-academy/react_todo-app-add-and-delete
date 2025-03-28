import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorTypes';
import React, { useEffect } from 'react';

type Props = {
  message: ErrorType;
  onErrorHide: () => void;
};

export const ErrorMessageComponent: React.FC<Props> = React.memo(
  ({ message, onErrorHide }) => {
    useEffect(() => {
      const timerId = window.setTimeout(() => {
        onErrorHide();
      }, 3000);

      return () => {
        window.clearTimeout(timerId);
      };
    }, [message, onErrorHide]);

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !message,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onErrorHide}
        />
        {message}
      </div>
    );
  },
);

ErrorMessageComponent.displayName = 'ErrorMessageComponent';
