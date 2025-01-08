import React, { useEffect } from 'react';
import cn from 'classnames';

interface Props {
  errorType: string;
  clearError: () => void;
}

export const Errors: React.FC<Props> = props => {
  const { errorType, clearError } = props;

  useEffect(() => {
    const timeOut = setTimeout(clearError, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [errorType]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light has-text-weight-normal',
        { hidden: !errorType },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={clearError}
      />
      {errorType}
    </div>
  );
};
