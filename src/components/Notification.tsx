/* eslint-disable */ 
import { FC, useEffect } from 'react';
import { Error } from '../utils/Error';

type Props = {
  errorMessage: Error ;
  showNotification: boolean
  setShowNotification: (showNotification: boolean)=> void;
};

export const Notification: FC <Props> = ({
  errorMessage, showNotification, setShowNotification,
}) => {
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    } return;
  }, [showNotification]);

  return showNotification ? (
    <div className="notification is-danger is-light has-text-weight-normal">
      <button
        type="button"
        className="delete"
        aria-label="Mute volume"
        onClick={() => setShowNotification(false)}
      />
      {errorMessage}
    </div>
  ) : (
    <></>
  );
};
