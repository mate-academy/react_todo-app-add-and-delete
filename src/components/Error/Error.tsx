import React, { useEffect } from 'react';
import cn from 'classnames';

type Props = {
  errorMessage: string | null;
  setErrorMessage: (arg: null) => void;
};

export const Error: React.FC<Props> = ({ errorMessage, setErrorMessage }) => {
  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage, setErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="hide error button"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {errorMessage}
    </div>
  );
};
