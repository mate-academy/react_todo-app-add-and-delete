import cn from 'classnames';
import React, { Dispatch, useEffect } from 'react';
import { Errors } from '../types/Errors';

type Props = {
  errorMessage: string;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
};

export const ErrorMessage: React.FC<Props> = ({
  errorMessage,
  setErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(Errors.Empty), 3000);

      return () => clearTimeout(timer);
    }

    return;
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
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
