import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorsType } from '../types/Error';

interface Props {
  errorMessage: ErrorsType | null;
  onSetError: (error: ErrorsType | null) => void;
}

export const TodoNotification: React.FC<Props> = ({
  errorMessage,
  onSetError,
}) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const handleCloseNotification = useCallback(() => {
    setShowNotification(false);
    onSetError(null);
  }, [onSetError]);

  useEffect(() => {
    if (errorMessage) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        handleCloseNotification();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return undefined;
  }, [errorMessage, handleCloseNotification]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !showNotification },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleCloseNotification}
      />
      {errorMessage}
    </div>
  );
};
