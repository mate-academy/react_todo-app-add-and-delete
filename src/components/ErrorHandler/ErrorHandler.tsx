/* eslint-disable react-hooks/exhaustive-deps */

import cn from 'classnames';
import { ErrorTypes } from '../../types/errorTypes';
import { useEffect } from 'react';

type Props = {
  errorMessage: ErrorTypes | null;
  setErrorMessage: (errorMessage: ErrorTypes | null) => void;
};

export const ErrorHandler: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorMessage,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
