import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string;
  clearError: () => void;
};

export const ErrorNotification: React.FC<Props> = React.memo(
  ({ errorMessage, clearError }) => {
    useEffect(() => {
      const timerId = setTimeout(() => {
        clearError();
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }, [errorMessage, clearError]);

    return (
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
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
  (prevProps: Props, nextProps: Props) =>
    prevProps.errorMessage === nextProps.errorMessage,
);

ErrorNotification.displayName = 'ErrorNotification';
