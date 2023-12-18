import { useEffect, useRef } from 'react';
import { getErrorMessage } from '../../helpers';
import { ErrorType } from '../../types/ErorTypes';

type Props = {
  error: ErrorType | null;
  onClose: () => void;
};

export const Errors: React.FC<Props> = ({ error, onClose }) => {
  const errorMessage = getErrorMessage(error);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (error) {
      timerRef.current = window.setTimeout(() => {
        onClose();
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [error, onClose]);

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"

    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
        aria-label="Close message"
      />
      {errorMessage}
    </div>
  );
};
