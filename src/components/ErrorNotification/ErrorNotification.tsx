import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  errorMessage: string,
  onErrorMessage: (message : string) => void,
};

export const ErrorNotification: React.FC<Props> = React.memo(({
  errorMessage,
  onErrorMessage,
}) => {
  function handleError(message: string) {
    onErrorMessage(message);

    if (!message) {
      return;
    }

    setTimeout(() => onErrorMessage(''), 3000);
  }

  useEffect(() => {
    handleError(errorMessage);
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        aria-label="HideErrorButton"
        onClick={() => handleError('')}
      />
      {errorMessage}
    </div>
  );
});
