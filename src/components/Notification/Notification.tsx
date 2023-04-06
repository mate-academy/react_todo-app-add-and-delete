/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect } from 'react';
import { useAppContext } from '../AppProvider';

export const Notification: React.FC = () => {
  const {
    errorMessage: error,
    setHideNotification,
    hideNotification,
  } = useAppContext();

  useEffect(() => {
    if (!hideNotification) {
      setTimeout(setHideNotification, 3000, true);
    }
  }, [hideNotification]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: hideNotification },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setHideNotification(true)}
      />
      {error}
    </div>
  );
};
