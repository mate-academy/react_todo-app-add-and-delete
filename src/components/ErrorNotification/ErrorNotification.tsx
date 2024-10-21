import React, { useEffect } from 'react';
import { Errors } from '../../types/Errors';
import classNames from 'classnames';

type Props = {
  errorMessage: string;
  onErrorMessage: (error: Errors) => void;
};

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  onErrorMessage,
}) => {
  useEffect(() => {
    if (errorMessage !== Errors.noneError) {
      const timeoutId = setTimeout(() => {
        onErrorMessage(Errors.noneError);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return;
  }, [errorMessage, onErrorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === Errors.noneError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onErrorMessage(Errors.noneError)}
      />
      {errorMessage}
    </div>
  );
};
