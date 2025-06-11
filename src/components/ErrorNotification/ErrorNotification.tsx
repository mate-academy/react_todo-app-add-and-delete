import React, { useEffect, useState } from 'react';

interface ErrorNotificationProps {
  errorNotification: string;
  setErrorNotification: (arg: string) => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  errorNotification,
  setErrorNotification,
}) => {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (errorNotification) {
      setIsHidden(false);
    }

    const timeout = setTimeout(() => {
      setIsHidden(true);
      setErrorNotification('');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [errorNotification, setErrorNotification]);

  const handleHideErrorButton = () => {
    setIsHidden(true);
    setErrorNotification('');
  };

  return (
    /* DON'T use conditional rendering to hide the notification */
    /* Add the 'hidden' class to hide the message smoothly */
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${isHidden ? 'hidden' : ''}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleHideErrorButton}
      />
      {errorNotification}
    </div>
  );
};
