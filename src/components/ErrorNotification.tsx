import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  isVisible: boolean;
  message: string;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  isVisible,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !isVisible,
        },
      )}
    >
      <button
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={onClose}
      />
      {message}
    </div>
  );
};
