import classNames from 'classnames';
import { ErrorStatus } from '../types/ErrorStatus';
import { useEffect } from 'react';

type Props = {
  errorMessage: ErrorStatus;
  onError: (newErrorMessage: ErrorStatus) => void;
};

export const TodoError: React.FC<Props> = ({ errorMessage, onError }) => {
  useEffect(() => {
    if (errorMessage === ErrorStatus.NONE) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onError(ErrorStatus.NONE);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage, onError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === ErrorStatus.NONE },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onError(ErrorStatus.NONE)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
