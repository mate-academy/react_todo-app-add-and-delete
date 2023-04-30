import { useState, useEffect } from 'react';

type Props = {
  message: string;
};

export const Notification: React.FC<Props> = ({ message }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setShowNotification(true);

    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const handleClose = () => {
    setShowNotification(false);
  };

  return (
    <>
      {showNotification && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {/* eslint-disable jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="delete"
            onClick={handleClose}
          />

          {message}
        </div>
      )}
    </>
  );
};
