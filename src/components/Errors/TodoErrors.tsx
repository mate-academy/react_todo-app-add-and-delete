import classNames from 'classnames';
import React, { useEffect } from 'react';
import { TodoTypeError } from '../../types/TodoTypeErrors';

type Props = {
  error: TodoTypeError | null;
  setError: (error: TodoTypeError | null) => void;
  setShowError: (show: boolean) => void;
  showError: boolean;
};

export const TodoErrors: React.FC<Props> = ({
  error,
  setError,
  setShowError,
  showError,
}) => {
  // Hide error after 3 seconds
  useEffect(() => {
    if (showError && error) {
      const timer = setTimeout(() => {
        setShowError(false);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [showError, error, setShowError, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !showError || !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setShowError(false);
          setError(null);
        }}
      />
      {error}
    </div>
  );
};
