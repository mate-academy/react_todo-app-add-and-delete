import React, { useEffect } from 'react';
import cn from 'classnames';
import { Error } from '../types/Error';

type Props = {
  errorType: Error | null,
  setErrorType: (error: Error | null) => void,
};

export const TodoError: React.FC<Props> = ({
  errorType,
  setErrorType,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorType(null);
    }, 3000);
  }, [setErrorType]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal',
        { hidden: errorType === null })}
    >
      <button
        aria-label="Hide Notification"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorType(null)}
      />
      {errorType}
    </div>
  );
};
