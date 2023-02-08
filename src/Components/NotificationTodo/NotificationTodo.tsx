import React, { useEffect } from 'react';
import classNames from 'classnames';

type PropsType = {
  error: boolean,
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  errorNotification: string,
  clearNotification: () => void;
};

export const NotificationTodo: React.FC<PropsType> = React.memo(
  ({
    error,
    setError,
    errorNotification,
    clearNotification,
  }) => {
    useEffect(() => {
      setTimeout(() => setError(false), 3000);
    }, [error]);

    return (
      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
      >

        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className="delete"
          onClick={clearNotification}
        />

        {errorNotification}
      </div>
    );
  },
);
