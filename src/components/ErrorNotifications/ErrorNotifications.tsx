import classNames from 'classnames';
import React, { useCallback, useEffect, useRef } from 'react';

interface Props {
  currentError: string;
  setCurrentError: React.Dispatch<React.SetStateAction<string>>;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>
}

export const ErrorNotification: React.FC<Props> = (props) => {
  const {
    currentError,
    setCurrentError,
    hasError,
    setHasError,
  } = props;

  const timerRef = useRef<NodeJS.Timer>();

  const resetCurrentError = useCallback(
    () => {
      setCurrentError('');
      setHasError(false);
    },
    [currentError],
  );

  useEffect(() => {
    if (hasError) {
      timerRef.current = setTimeout(resetCurrentError, 3000);
    } else {
      clearTimeout(timerRef.current);
    }
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
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
        onClick={resetCurrentError}
      />
      {currentError}
    </div>
  );
};
