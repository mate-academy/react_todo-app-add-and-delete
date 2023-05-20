import { useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../../types/types/ErrorMessage';

type Props = {
  errorMessage: ErrorMessage,
  closeError: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  closeError,
}) => {
  useEffect(() => {
    setInterval(closeError, 3000);
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        type="button"
        className="delete"
        onClick={closeError}
      >
        ×
      </button>

      {errorMessage}
    </div>
  );
};
