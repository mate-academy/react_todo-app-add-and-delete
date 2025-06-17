import cn from 'classnames';
import { ErrorType } from '../types/ErrorType';
import { useEffect } from 'react';

const ERROR_DURATION = 3000;

type ErrorMessageProps = {
  onClear: () => void;
  message: ErrorType;
};

export const ErrorNotification: React.FC<ErrorMessageProps> = ({
  onClear,
  message,
}) => {
  useEffect(() => {
    if (!Boolean(message.length)) {
      return;
    }

    const timer = setTimeout(() => {
      onClear();
    }, ERROR_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !message },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClear}
      />
      {/* show only one message at a time */}
      {message}
    </div>
  );
};
