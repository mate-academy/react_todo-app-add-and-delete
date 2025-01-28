import { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ErrorsEnum } from '../types/Error.enum';

interface Props {
  error: ErrorsEnum | null;
  onSetError: (error: ErrorsEnum | null) => void;
}

export const Notification: FC<Props> = ({ error, onSetError }) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const handleCloseNotification = useCallback(() => {
    setShowNotification(false);
    onSetError(null);
  }, [onSetError]);

  useEffect(() => {
    if (error) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        handleCloseNotification();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return undefined;
  }, [error, handleCloseNotification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !showNotification },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseNotification}
      />
      {error}
    </div>
  );
};
