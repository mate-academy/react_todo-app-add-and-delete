import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';

type Props = {
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  hasError: boolean,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>,
};

export const ErrorNotification: React.FC<Props> = ({
  error,
  setError,
  hasError,
  setHasError,
}) => {
  const resetError = useCallback(
    () => {
      setError('');
      setHasError(false);
    },
    [error],
  );

  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (hasError) {
      timerRef.current = setTimeout(resetError, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !hasError,
        },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={resetError}
      />
      {error}
    </div>
  );
};
