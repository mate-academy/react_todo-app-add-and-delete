import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
};

export const TodoError: React.FC<Props> = ({ errorMessage, onClose }) => {
  const [isErrorVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsVisible(true);
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isErrorVisible },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close error notification"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
