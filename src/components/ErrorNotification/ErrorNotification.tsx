import classNames from 'classnames';
import React, { useEffect } from 'react';

type Props = {
  errorMessage: string | null;
  onClose: () => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(onClose, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        type="button"
        className="delete"
        data-cy="HideErrorButton"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
