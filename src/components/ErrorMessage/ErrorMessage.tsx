import React, { useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/errorMessages';

type Props = {
  errorMessage: ErrorMessages;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ErrorMessage: React.FC<Props> = React.memo(({
  errorMessage,
  hasError,
  setHasError,
}) => {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setHasError(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [hasError]);

  return (
    <div className={cn(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: !hasError },
    )}
    >
      <button
        type="button"
        aria-label="Close"
        className="delete"
        onClick={() => setHasError(false)}
      />

      {errorMessage}
    </div>
  );
});
