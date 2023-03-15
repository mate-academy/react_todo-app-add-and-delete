import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { ErrorAction } from '../../types/ErrorAction';

type Props = {
  errorMessage: ErrorAction;
  onClose: () => void;
};

export const Notification: React.FC<Props> = ({
  errorMessage,
  onClose,
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (errorMessage !== ErrorAction.NONE) {
      setError(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        aria-label="close"
        type="button"
        className="delete"
        onClick={onClose}
      />

      {error}
    </div>
  );
};
