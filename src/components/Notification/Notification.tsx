/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { AppContext } from '../AppProvider';

export const Notification: React.FC = () => {
  const {
    error,
    setHideNotification,
    hideNotification,
  } = useContext(AppContext);

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
