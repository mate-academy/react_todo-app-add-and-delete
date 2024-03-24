import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ErrorContext } from '../../contexts/ErrorContext';

const NOTIFICATION_DURATION = 3000;

export const ErrorNotification: React.FC = () => {
  const { error } = useContext(ErrorContext);
  const [isShown, setIsShown] = useState(false);
  const timer = useRef(0);

  const hideError = () => {
    clearTimeout(timer.current);
    setIsShown(false);
  };

  useEffect(() => {
    hideError();

    if (error.message.length) {
      setIsShown(true);

      timer.current = window.setTimeout(
        () => setIsShown(false),
        NOTIFICATION_DURATION,
      );
    }
  }, [error]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger is-light',
        'has-text-weight-normal',
        { hidden: !isShown },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={hideError}
      />
      {error.message}
    </div>
  );
};
