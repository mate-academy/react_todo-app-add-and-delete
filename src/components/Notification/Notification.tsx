/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';

export type ErrorAction = '' | 'load' | 'add' | 'delete' | 'update';

type Props = {
  message: ErrorMessage;
  onClose: () => void;
};

export const Notification: FC<Props> = ({
  message,
  onClose,
}) => {
  const [error, setError] = useState('');

  useEffect(() => {
    if (message) {
      setError(message);
    }
  }, [message]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={onClose}
      />

      {error}
    </div>
  );
};
