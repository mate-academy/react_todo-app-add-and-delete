import React, { useEffect } from 'react';
import { ErrorNotifications } from '../../types/ErrorNotifications';

type Props = {
  errorMessage: ErrorNotifications,
  setError: (condition: boolean) => void,
};

export const ErrorMessage: React.FC<Props> = React.memo(
  ({
    errorMessage,
    setError,
  }) => {
    useEffect(() => {
      window.setTimeout(() => {
        setError(false);
      }, 3000);
    }, []);

    return (
      <div className="notification is-danger is-light has-text-weight-normal">
        <button
          type="button"
          className="delete"
          aria-label="this button remove error notification"
          onClick={() => {
            setError(false);
          }}
        />
        {errorMessage}
      </div>
    );
  },
);
