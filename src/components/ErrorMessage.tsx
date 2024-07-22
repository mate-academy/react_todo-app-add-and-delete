import { useEffect, useRef } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: null | string;
  setErrorMessage: (value: null | string) => void;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  const timerId = useRef(0);

  useEffect(() => {
    timerId.current = window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timerId.current);
    };
  });

  const handleCloseNotification = () => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    setErrorMessage(null);
  };

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Close notification"
        onClick={handleCloseNotification}
      />
      {errorMessage}
      {/* Unable to update a todo */}
    </div>
  );
};
