import cn from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
  setError: (value: string) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
  setError,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage, setError]);

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
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
