import classNames from 'classnames';
import React, { useEffect, useRef, useCallback } from 'react';
import { ErrorType } from '../types/Errors';

type Props = {
  currError: string;
  setCurrError: React.Dispatch<React.SetStateAction<string>>;
};

export const Errors: React.FC<Props> = ({ currError, setCurrError }) => {
  const timer = useRef<NodeJS.Timer>();

  const closeError = useCallback(
    () => {
      setCurrError('');
    },
    [currError],
  );

  const noError = currError === ErrorType.None;

  useEffect(() => {
    if (!noError) {
      timer.current = setTimeout(() => {
        setCurrError(ErrorType.None);
      }, 3000);
    } else {
      clearTimeout(timer.current);
    }
  }, [currError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal', {
          hidden: currError === '',
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="Toggle All"
        onClick={closeError}
      />

      {currError}
    </div>
  );
};
