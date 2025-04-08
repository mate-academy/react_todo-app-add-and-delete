import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Errors } from '../types/Errors';

type Props = {
  errorMessage: Errors;
  clearError: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage, clearError }) => {
    useEffect(() => {
      if (!errorMessage) {
        return;
      }

      const timerId = setTimeout(() => {
        clearError();
      }, 3000);

      return () => clearTimeout(timerId);
    }, [errorMessage, clearError]);

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={clearError}
        />
        {errorMessage}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.errorMessage === nextProps.errorMessage,
);

ErrorNotification.displayName = 'ErrorNotification';
