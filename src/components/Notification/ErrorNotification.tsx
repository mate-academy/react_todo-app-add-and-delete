import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  setErrorMessage: (err: string) => void;
};
export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (errorMessage) {
      setIsVisible(true);
      timer = setTimeout(() => {
        setErrorMessage('');
        setIsVisible(false);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      // eslint-disable-next-line
      className={classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !isVisible,
      })}
    >
      <button
        type="button"
        className="delete"
        aria-label="Close Error Notification"
        onClick={() => setErrorMessage('')}
      />

      {errorMessage}
    </div>
  );
};
