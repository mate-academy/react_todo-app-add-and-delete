import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { ErrorContext } from '../context/ErrorContextProvider';

export const Notification: React.FC = () => {
  const errorContext = useContext(ErrorContext);

  useEffect(() => {
    if (errorContext.errorMessage) {
      errorContext.setHideError(false);
    }

    const timeoutId = setTimeout(() => {
      errorContext.setHideError(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorContext.errorMessage]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorContext.hideError },
      )}
      onTransitionEnd={() => {
        if (errorContext.hideError) {
          errorContext.setErrorMessage(null);
        }
      }}
    >
      {errorContext.errorMessage}
      <button
        type="button"
        aria-label="button"
        className="delete"
        onClick={() => {
          errorContext.setHideError(true);
        }}
      />
    </div>
  );
};
