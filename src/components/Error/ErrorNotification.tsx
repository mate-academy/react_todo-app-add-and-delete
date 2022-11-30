import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  hasError: boolean,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>,
  errorMessage: string,
  handleErrorClose: () => void,
};

export const ErrorNotification: React.FC<Props> = ({
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
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !hasError },
      )}
    >
      <button
        data-cy="HideErrorButton"
        aria-label="HideErrorButton"
        type="button"
        className="delete"
        onClick={handleErrorClose}
      />
      {errorMessage}
    </div>
  );
};
