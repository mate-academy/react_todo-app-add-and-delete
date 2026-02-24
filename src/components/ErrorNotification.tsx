/**
 * Component for displaying error messages with an auto-hide feature
 */
import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  // Effect to handle automatic hiding of the error message after 3 seconds
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage, onClose]);

  return (
    /* We use the 'hidden' class instead of conditional rendering to allow for CSS transitions */
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
