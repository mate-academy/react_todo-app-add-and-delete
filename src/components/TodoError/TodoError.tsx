import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

interface Props {
  message: string | null;
  onClose: () => void;
}

export const TodoError: React.FC<Props> = ({ message, onClose }) => {
  const timerId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (message) {
      timerId.current = setTimeout(() => {
        onClose();
      }, 3000);
    }

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [message, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !message,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
