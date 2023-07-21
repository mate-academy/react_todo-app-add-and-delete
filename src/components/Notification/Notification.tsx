import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

interface Props {
  errorMessage: string;
  onClose: () => void;
}

export const Notification: React.FC<Props> = ({ errorMessage, onClose }) => {
  const [isShowNotification, setIsShowNotification] = useState(false);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    if (errorMessage) {
      setIsShowNotification(true);

      hideTimeout = setTimeout(() => {
        setIsShowNotification(false);
        onClose();
      }, 3000);
    }

    return () => {
      clearTimeout(hideTimeout);
      setIsShowNotification(false);
    };
  }, [errorMessage, onClose]);

  const handleClose = () => {
    setIsShowNotification(false);
    onClose();
  };

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !isShowNotification,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={handleClose}
        aria-label="Close error"
      />

      {errorMessage && (
        <>
          {errorMessage}
          <br />
        </>
      )}
    </div>
  );
};
