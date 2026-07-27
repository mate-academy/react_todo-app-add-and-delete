import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { ErrorMessage } from '../../types/Errors';

interface Props {
  onClose: (err: ErrorMessage) => void;
  errMessage: ErrorMessage;
  duration?: number;
}

export const ErrComponent: React.FC<Props> = ({
  errMessage,
  onClose,
  duration = 3000,
}) => {
  const [localErr, setLocalErr] = useState(errMessage);

  useEffect(() => {
    if (!errMessage) {
      return;
    }

    setLocalErr(errMessage);

    const timerId = setTimeout(() => {
      onClose(ErrorMessage.None);
    }, duration);

    return () => clearTimeout(timerId);
  }, [errMessage, onClose, duration]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errMessage === '',
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onClose(ErrorMessage.None);
        }}
      />
      {localErr}
    </div>
  );
};
