import React, { useEffect } from 'react';
import cn from 'classnames';

interface Prop {
  hasError: boolean;
  setHasError: (value: boolean) => void;
  errorMessage: string;
  handleErrorClose: () => void;
}

export const ErrorNotification: React.FC<Prop> = ({
  hasError,
  setHasError,
  errorMessage,
  handleErrorClose,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [hasError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClose}
      />
      {errorMessage}
    </div>
  );
};
